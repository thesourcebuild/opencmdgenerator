"use client";

import { useEffect, useRef, useState } from "react";
import { platform } from "@cmdgen/platform";
import { Button, Panel, cn } from "@cmdgen/ui";
import type { RunShellKind } from "@cmdgen/contracts";
import type { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export interface RunTerminalPanelProps {
  shellKind: RunShellKind;
  /** Written into the session once it opens — no trailing Enter; the human presses it. */
  initialCommand: string;
  onClose: () => void;
}

/**
 * A real, live interactive terminal — not a read-only output log. Once the
 * session opens, anything typed here (including replies to prompts) reaches
 * the real shell exactly like a normal terminal would; none of this app's
 * lint/confirmation machinery is involved past this point. See
 * `apps/desktop/src/main/run.ts`'s header comment for the full design
 * rationale and `run-confirm-modal.tsx` for the gate that precedes this.
 */
export function RunTerminalPanel({ shellKind, initialCommand, onClose }: RunTerminalPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | undefined>(undefined);
  const [status, setStatus] = useState<"starting" | "running" | "closed" | "error">("starting");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  // Hides the terminal's own viewport without touching the session — the
  // container div stays mounted so xterm.js's Terminal instance (attached to
  // it once, at mount) is never torn down. A `Panel collapsible` would
  // conditionally unmount `children` instead, which would detach xterm.js
  // from its container and lose the live view on restore.
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    let term: Terminal | undefined;

    async function start() {
      const [{ Terminal }, { FitAddon }] = await Promise.all([import("@xterm/xterm"), import("@xterm/addon-fit")]);
      if (disposed || !containerRef.current) return;

      term = new Terminal({
        cursorBlink: true,
        fontSize: 13,
        fontFamily: "var(--font-mono, monospace)",
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(containerRef.current);
      fit.fit();

      const resizeObserver = new ResizeObserver(() => {
        // Minimized (display:none) reports a zero-size container — skip
        // fitting to that, or the pty would get resized down to 1x1.
        if (!containerRef.current || containerRef.current.offsetWidth === 0) return;
        fit.fit();
        const sessionId = sessionIdRef.current;
        if (sessionId) void platform().runResize({ sessionId, cols: term!.cols, rows: term!.rows });
      });
      resizeObserver.observe(containerRef.current);

      try {
        const session = await platform().runStart({ shellKind });
        if (disposed) {
          await platform().runKill({ sessionId: session.sessionId });
          return;
        }
        sessionIdRef.current = session.sessionId;
        setStatus("running");

        unsubscribe = platform().onRunData(({ sessionId, chunk }) => {
          if (sessionId === session.sessionId) term!.write(chunk);
        });

        term.onData((data) => {
          void platform().runWrite({ sessionId: session.sessionId, data });
        });

        // Populate-only: the generated command is typed in, but nothing is
        // submitted — the human presses Enter themselves, in the terminal.
        await platform().runWrite({ sessionId: session.sessionId, data: initialCommand });
      } catch (error) {
        if (!disposed) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : String(error));
        }
      }

      return () => resizeObserver.disconnect();
    }

    const cleanupPromise = start();

    return () => {
      disposed = true;
      unsubscribe?.();
      void cleanupPromise.then((cleanup) => cleanup?.());
      const sessionId = sessionIdRef.current;
      if (sessionId) void platform().runKill({ sessionId }).catch(() => undefined);
      term?.dispose();
    };
    // shellKind/initialCommand are only meaningful at mount time — this panel is
    // remounted (via a key) rather than updated in place when either changes.
  }, []);

  const stop = () => {
    const sessionId = sessionIdRef.current;
    if (sessionId) void platform().runKill({ sessionId });
    setStatus("closed");
    onClose();
  };

  return (
    <Panel
      title="Terminal"
      description={
        status === "error"
          ? errorMessage
          : minimized
            ? "Minimized — still running in the background. Restore to see it again."
            : "A real, live shell session. Anything you type here runs for real."
      }
      actions={
        <>
          <Button size="sm" variant="secondary" onClick={() => setMinimized((m) => !m)}>
            {minimized ? "Restore" : "Minimize"}
          </Button>
          <Button size="sm" variant="danger" onClick={stop}>
            Stop
          </Button>
        </>
      }
    >
      <div ref={containerRef} className={cn("h-80 overflow-hidden rounded-md bg-black", minimized && "hidden")} />
    </Panel>
  );
}
