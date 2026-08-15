/**
 * The one file in this project that spawns a real process. Everything else
 * under `apps/desktop/src/**` is banned from doing so by eslint — this file
 * is named as the single explicit exception in `eslint.config.mjs`, which
 * still bans `child_process`/`node:child_process` even here: every spawn
 * here goes through `node-pty` only. See README.md's amended "It generates
 * commands. It never executes them." claim for the one deliberate,
 * confirmation-gated exception this file implements.
 *
 * Design choices, and why:
 *
 * - Opens a REAL interactive shell, not a fixed-argv exec of the parsed
 *   command. The rendered command text is written to that shell's stdin
 *   exactly as a human pasting it would, preserving full shell semantics
 *   (pipes, redirects) a no-shell exec would flatten. This is a deliberate
 *   trade-off, not a safety feature — it is not "safer" than a no-shell exec
 *   of the tokenized argv `buildArgv()` already produces. The actual safety
 *   weight is carried by the UI's mandatory confirmation modal (see
 *   `run-confirm-modal.tsx`), not by anything in this file.
 * - `shellKind` is a closed enum (`RunShellKind`) resolved to a real,
 *   absolute path ONLY here, from a hardcoded table — the renderer can
 *   never supply a path or extra spawn arguments.
 * - `writeToSession` (IPC channel `run:write`), not `startSession`, is the
 *   actually sensitive capability: once a session exists, arbitrary bytes
 *   reach a live shell. Every operation on a session verifies the calling
 *   window actually owns it.
 * - Windows and Linux are both real, packaged targets (`resolveShell` covers
 *   cmd/PowerShell/WSL on Windows, bash on Linux); Mac is not — no mac.target
 *   build has ever exercised node-pty's native binary. `shellKindsForThisHost()`
 *   is the authoritative, main-process-side check for which `RunShellKind`s
 *   the CURRENT host can run — the renderer's own `runnableShellKinds` gating
 *   is a UI convenience, never trusted as the actual security boundary here.
 */
import { randomUUID } from "node:crypto";
import * as pty from "node-pty";
import type { RunShellKind } from "@cmdgen/contracts";

const MAX_SESSIONS_PER_WINDOW = 3;
const MAX_WRITE_BYTES = 8192;
/** Coalesce output on a short timer — this is the app's first continuous-streaming IPC traffic, and unbatched per-chunk sends can flood the renderer. */
const DATA_FLUSH_MS = 16;

interface Session {
  id: string;
  windowId: number;
  shellKind: RunShellKind;
  pty: pty.IPty;
  auditedFirstWrite: boolean;
  pendingData: string;
  flushTimer: ReturnType<typeof setTimeout> | null;
}

const sessions = new Map<string, Session>();

/** Every Run's initial command — {text, shellKind, timestamp}, never output. In-memory only; not persisted to disk. */
export const runAuditLog: { text: string; shellKind: RunShellKind; timestamp: number }[] = [];

/** Registered once by ipc.ts; called whenever a session has output to deliver. */
let onData: ((sessionId: string, chunk: string, windowId: number) => void) | undefined;
export function setRunDataHandler(handler: (sessionId: string, chunk: string, windowId: number) => void): void {
  onData = handler;
}

function countSessionsForWindow(windowId: number): number {
  let count = 0;
  for (const session of sessions.values()) if (session.windowId === windowId) count++;
  return count;
}

/**
 * Which `RunShellKind`s this host can actually spawn — authoritative here,
 * not trusted from the renderer's own `runnableShellKinds` gating. A buggy
 * or compromised renderer could still send `shellKind: "bash"` to a Windows
 * main process (or vice versa); `startSession` checks this before ever
 * reaching `resolveShell`.
 */
function shellKindsForThisHost(): RunShellKind[] {
  if (process.platform === "win32") return ["cmd", "powershell", "wsl"];
  if (process.platform === "linux") return ["bash"];
  return [];
}

/** Resolves a closed enum to a real, absolute shell path — the ONLY place that decision is made. */
function resolveShell(shellKind: RunShellKind): { command: string; args: string[] } {
  switch (shellKind) {
    case "cmd": {
      const systemRoot = process.env.SystemRoot ?? "C:\\Windows";
      return { command: `${systemRoot}\\System32\\cmd.exe`, args: [] };
    }
    case "powershell": {
      const systemRoot = process.env.SystemRoot ?? "C:\\Windows";
      return { command: `${systemRoot}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`, args: ["-NoLogo"] };
    }
    case "wsl": {
      const systemRoot = process.env.SystemRoot ?? "C:\\Windows";
      return { command: `${systemRoot}\\System32\\wsl.exe`, args: [] };
    }
    case "bash":
      // Universal on every mainstream distro's default install; no probing
      // needed the way WSL needs a Store-prompt-avoidance check above — a
      // missing /bin/bash just fails the spawn visibly in the terminal panel.
      return { command: "/bin/bash", args: [] };
  }
}

/**
 * `wsl.exe` with no distro installed pops a Microsoft Store prompt instead
 * of failing — probe first (via a throwaway node-pty spawn, not
 * child_process, to keep this file's eslint exception scoped to node-pty
 * only) so a missing WSL install fails visibly in the terminal panel
 * instead of surprising the user with an OS dialog.
 */
async function assertWslAvailable(wslPath: string): Promise<void> {
  const probe = pty.spawn(wslPath, ["--status"], { name: "xterm-color", cols: 80, rows: 24 });
  const exitCode = await new Promise<number>((resolve) => {
    const timeout = setTimeout(() => {
      probe.kill();
      resolve(-1);
    }, 5000);
    probe.onExit(({ exitCode }) => {
      clearTimeout(timeout);
      resolve(exitCode);
    });
  });
  if (exitCode !== 0) {
    throw new Error("WSL isn't installed or has no default distro. Install it first (wsl --install), or switch Target Platform away from WSL.");
  }
}

export interface StartSessionOptions {
  windowId: number;
  shellKind: RunShellKind;
  cwd?: string;
}

export async function startSession({ windowId, shellKind, cwd }: StartSessionOptions): Promise<{ sessionId: string }> {
  if (countSessionsForWindow(windowId) >= MAX_SESSIONS_PER_WINDOW) {
    throw new Error(`Too many open Run sessions for this window (max ${MAX_SESSIONS_PER_WINDOW}). Close one first.`);
  }
  if (!shellKindsForThisHost().includes(shellKind)) {
    throw new Error(`"${shellKind}" isn't a shell this host (${process.platform}) can run.`);
  }

  const { command, args } = resolveShell(shellKind);
  if (shellKind === "wsl") await assertWslAvailable(command);

  const id = randomUUID();
  const proc = pty.spawn(command, args, {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: cwd ?? process.env.USERPROFILE ?? process.env.HOME,
    env: process.env as Record<string, string>,
  });

  const session: Session = {
    id,
    windowId,
    shellKind,
    pty: proc,
    auditedFirstWrite: false,
    pendingData: "",
    flushTimer: null,
  };
  sessions.set(id, session);

  proc.onData((chunk) => {
    session.pendingData += chunk;
    if (session.flushTimer) return;
    session.flushTimer = setTimeout(() => {
      session.flushTimer = null;
      const data = session.pendingData;
      session.pendingData = "";
      onData?.(session.id, data, session.windowId);
    }, DATA_FLUSH_MS);
  });

  proc.onExit(() => {
    if (session.flushTimer) clearTimeout(session.flushTimer);
    sessions.delete(id);
  });

  return { sessionId: id };
}

function requireOwnedSession(windowId: number, sessionId: string): Session {
  const session = sessions.get(sessionId);
  if (!session || session.windowId !== windowId) {
    throw new Error("Unknown or unowned Run session.");
  }
  return session;
}

export function writeToSession(windowId: number, sessionId: string, data: string): void {
  const session = requireOwnedSession(windowId, sessionId);
  const bytes = data.length > MAX_WRITE_BYTES ? data.slice(0, MAX_WRITE_BYTES) : data;

  if (!session.auditedFirstWrite) {
    session.auditedFirstWrite = true;
    runAuditLog.push({ text: bytes, shellKind: session.shellKind, timestamp: Date.now() });
  }

  session.pty.write(bytes);
}

export function resizeSession(windowId: number, sessionId: string, cols: number, rows: number): void {
  const session = requireOwnedSession(windowId, sessionId);
  session.pty.resize(Math.max(1, Math.min(cols, 500)), Math.max(1, Math.min(rows, 500)));
}

export function killSession(windowId: number, sessionId: string): void {
  const session = requireOwnedSession(windowId, sessionId);
  session.pty.kill();
  sessions.delete(sessionId);
}

/** Called on that window's "closed" event — a closed window's sessions have no one left to stream output to. */
export function killSessionsForWindow(windowId: number): void {
  for (const session of sessions.values()) {
    if (session.windowId !== windowId) continue;
    session.pty.kill();
    sessions.delete(session.id);
  }
}

/** Called on app "before-quit"/"window-all-closed" — no orphaned shells survive the app exiting. */
export function killAllSessions(): void {
  for (const session of sessions.values()) session.pty.kill();
  sessions.clear();
}
