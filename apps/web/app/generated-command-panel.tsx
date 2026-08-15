"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import type { RunShellKind } from "@cmdgen/contracts";
import { layoutMultiLine, type RenderedToken } from "@cmdgen/engine";
import { platform } from "@cmdgen/platform";
import { Button, Panel, cn } from "@cmdgen/ui";
import { RunConfirmModal } from "./run-confirm-modal";
import { RunTerminalPanel } from "./run-terminal-panel";
import { toRunShellKind } from "./run-shell-kind";
import { TokenLine } from "./token-line";

export interface GeneratedCommandVariant {
  id: string;
  label: string;
  /** Role-tagged, quoted tokens for this variant's one-line rendering. */
  tokens: readonly RenderedToken[];
  /** Footnote shown only while this variant is active — e.g. rsync's dry-run explainer. */
  note?: ReactNode;
}

export interface GeneratedCommandPanelProps {
  description?: string;
  /** How multi-line layout joins wrapped lines — " \\" (POSIX), " `" (PowerShell), " ^" (cmd.exe), ... */
  continuation: string;
  /**
   * One entry per ARGV variant this command offers — most commands have
   * exactly one; rsync adds a second for its dry-run twin. The tab row for
   * switching between them only appears when there's more than one.
   */
  variants: readonly GeneratedCommandVariant[];
  /** Controls specific to one command's own rendering model — e.g. rsync's shell picker. */
  extraActions?: ReactNode;
  /**
   * The current platform/dialect value, in whatever spelling this command's
   * own enum uses ("cmd"/"windows-cmd", "powershell"/"windows-powershell",
   * "wsl"/"windows-wsl", or anything else). Omit entirely for a command with
   * no platform axis at all. Passed through `toRunShellKind` to decide
   * whether Run is offered at all — see that function's own comment.
   */
  dialect?: string;
  /** Whether the current spec has any `destructive`-level lint diagnostic — gates the extra confirmation friction, not whether Run appears at all. */
  isDestructive?: boolean;
}

type Layout = "oneline" | "multiline";

/**
 * The one "Generated command" panel every command's builder uses. One-line
 * vs multi-line layout, and copy-to-clipboard, are built in here — common to
 * every command, not something each re-implements. What varies is only the
 * tokens themselves and, optionally, extra ARGV variants and controls.
 */
export function GeneratedCommandPanel({
  description,
  continuation,
  variants,
  extraActions,
  dialect,
  isDestructive = false,
}: GeneratedCommandPanelProps) {
  const [activeVariantId, setActiveVariantId] = useState(variants[0]!.id);
  const [layout, setLayout] = useState<Layout>("oneline");
  const [copied, setCopied] = useState(false);
  const [canRunCommands, setCanRunCommands] = useState(false);
  const [runnableShellKinds, setRunnableShellKinds] = useState<RunShellKind[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [terminalKey, setTerminalKey] = useState<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void platform()
      .environment()
      .then((env) => {
        if (!cancelled) {
          setCanRunCommands(env.canRunCommands);
          setRunnableShellKinds(env.runnableShellKinds);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const variant = variants.find((v) => v.id === activeVariantId) ?? variants[0]!;
  const multilineText = layoutMultiLine(variant.tokens, continuation);
  const mappedShellKind = dialect === undefined ? undefined : toRunShellKind(dialect);
  // A dialect can map to a real RunShellKind (e.g. "wsl") that still isn't
  // spawnable on THIS host (a Linux box has no wsl.exe) — runnableShellKinds
  // is the host-specific half of that check; mappedShellKind alone is not enough.
  const runShellKind = mappedShellKind && runnableShellKinds.includes(mappedShellKind) ? mappedShellKind : undefined;

  const commandText = () => (layout === "multiline" ? multilineText : variant.tokens.map((t) => t.text).join(" "));

  const copy = async () => {
    await platform().copyToClipboard(commandText());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Fragment>
      <Panel
        title="Generated command"
        description={description}
        actions={
          <>
            {extraActions}
            {canRunCommands && (
              <Button
                size="sm"
                variant="secondary"
                disabled={!runShellKind || terminalKey !== undefined}
                title={
                  terminalKey !== undefined
                    ? "A terminal is already open below — stop it before starting another."
                    : runShellKind
                      ? "Types this command into a real shell — nothing runs until you press Enter yourself."
                      : mappedShellKind
                        ? "Run isn't available for this shell on this host."
                        : "Run isn't available for this shell — switch Target Platform to a dialect this host can run (Windows: Command Prompt, PowerShell, or WSL; Linux: POSIX)."
                }
                onClick={() => setConfirmOpen(true)}
              >
                Run
              </Button>
            )}
            <Button size="sm" variant="primary" onClick={() => void copy()}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </>
        }
      >
        <div className="mb-3 flex flex-wrap items-center gap-1 text-xs">
          {(
            [
              ["oneline", "One line"],
              ["multiline", "Multi-line"],
            ] as [Layout, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setLayout(id)}
              className={cn(
                "rounded px-2 py-1 transition-colors",
                layout === id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
              )}
            >
              {label}
            </button>
          ))}

          {variants.length > 1 && (
            <>
              <span className="mx-1 text-slate-300 dark:text-slate-700" aria-hidden>
                |
              </span>
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveVariantId(v.id)}
                  className={cn(
                    "rounded px-2 py-1 transition-colors",
                    variant.id === v.id
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                  )}
                >
                  {v.label}
                </button>
              ))}
            </>
          )}
        </div>

        <pre className="overflow-x-auto rounded-md bg-slate-50 p-3 font-mono text-xs leading-relaxed dark:bg-slate-950">
          {layout === "multiline" ? <code>{multilineText}</code> : <TokenLine tokens={variant.tokens} />}
        </pre>

        {variant.note && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{variant.note}</p>}
      </Panel>

      {runShellKind && (
        <RunConfirmModal
          open={confirmOpen}
          commandText={commandText()}
          shellKind={runShellKind}
          isDestructive={isDestructive}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            setTerminalKey(Date.now());
          }}
        />
      )}

      {/* A new section after "Generated command", not nested inside it — a
          live terminal is a different kind of thing than a static preview,
          and each Run gets its own fresh section rather than reusing the
          previous one in place (the `key` forces a full remount per Run). */}
      {terminalKey !== undefined && runShellKind && (
        <div className="mt-4">
          <RunTerminalPanel
            key={terminalKey}
            shellKind={runShellKind}
            initialCommand={commandText()}
            onClose={() => setTerminalKey(undefined)}
          />
        </div>
      )}
    </Fragment>
  );
}
