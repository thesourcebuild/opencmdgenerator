import type { PathFlavor, ShellDialect } from "./env";

export type HostPlatform = "darwin" | "win32" | "linux" | "browser";

/**
 * A friendlier, flattened "web vs desktop, and on desktop, which OS" view —
 * derived from `PlatformEnvironment`, not a second source of truth. Use this
 * wherever UI code branches on host platform for something user-facing (e.g.
 * choosing a sensible default dropdown value); `HostPlatform` stays as the
 * raw Node-style value ("win32"/"darwin") the Electron bridge/preload
 * boundary legitimately deals in.
 */
export type AppPlatform = "web" | "windows" | "macos" | "linux";

export function toAppPlatform(env: Pick<PlatformEnvironment, "isDesktop" | "platform">): AppPlatform {
  if (!env.isDesktop) return "web";
  switch (env.platform) {
    case "win32":
      return "windows";
    case "darwin":
      return "macos";
    case "linux":
      return "linux";
    case "browser":
      // Never actually occurs alongside isDesktop: true — kept only so this
      // switch stays exhaustive over the full HostPlatform union.
      return "web";
  }
}

/**
 * The dialects `PlatformApi.runStart` accepts — each one a real, reliably
 * locatable shell binary on SOME host OS. Not every kind is spawnable on
 * every host: `cmd`/`powershell`/`wsl` only exist on Windows, `bash` only on
 * Linux (and, in principle, Mac — not yet enabled there). Which of these are
 * actually usable on the current host is `PlatformEnvironment.runnableShellKinds`,
 * not this type — this is just the closed set of values `resolveShell` in
 * `apps/desktop/src/main/run.ts` knows how to turn into a real path.
 * `posix`-dialect commands map to `bash` (see `apps/web/app/run-shell-kind.ts`);
 * `cygwin`/`msys` still have no dependable local install path on Windows, so
 * there is deliberately no value here for them.
 */
export type RunShellKind = "cmd" | "powershell" | "wsl" | "bash";

export interface PlatformEnvironment {
  /** True in the Electron shell, false in a browser tab. */
  isDesktop: boolean;
  platform: HostPlatform;
  appVersion: string;
  /** Sensible starting point for a new spec on this host. */
  defaultShell: ShellDialect;
  defaultPathFlavor: PathFlavor;
  /** Whether native directory picking is available at all. */
  canPickDirectories: boolean;
  /**
   * Whether `PlatformApi.runStart`/etc. actually work here at all — true on
   * the desktop shell on Windows and Linux, where a real `node-pty`-backed
   * shell can be spawned (see `apps/desktop/src/main/run.ts`). Always false
   * in a browser tab (nothing can spawn a process there) and false on Mac
   * until real packaging/CI exists for it. This is the coarse gate for
   * whether the Run button can appear at all; `runnableShellKinds` below is
   * the finer-grained gate for which specific dialects it works with.
   */
  canRunCommands: boolean;
  /**
   * Which `RunShellKind`s are actually spawnable on THIS host — e.g.
   * `["cmd", "powershell", "wsl"]` on Windows, `["bash"]` on Linux, `[]`
   * everywhere Run is unsupported. UI code checks a command's mapped
   * `RunShellKind` against this list, not just against `canRunCommands`, so
   * a `wsl`-dialect command doesn't show as runnable on a Linux host and
   * vice versa.
   */
  runnableShellKinds: RunShellKind[];
}

/** One live interactive shell session, returned by `runStart`. */
export interface RunSession {
  sessionId: string;
}

/** One chunk of output from a running session, delivered via `onRunData`. */
export interface RunDataEvent {
  sessionId: string;
  chunk: string;
}

export interface SaveResult {
  saved: boolean;
  /** Absolute path on desktop; undefined for a browser download. */
  path?: string;
}

export interface OpenedTextFile {
  name: string;
  contents: string;
}

/**
 * The complete set of host capabilities this app needs. It is small because the
 * app only generates rsync commands — it never executes anything.
 *
 * Shared UI code depends on this interface only. `@cmdgen/platform/electron` is
 * the sole module in the repo that touches Electron's IPC surface.
 */
export interface PlatformApi {
  environment(): Promise<PlatformEnvironment>;

  /** Returns undefined if the user cancelled, or if the host cannot pick directories. */
  pickDirectory(options?: { title?: string; startingPath?: string }): Promise<string | undefined>;
  pickFile(options?: { title?: string; extensions?: string[] }): Promise<string | undefined>;

  saveTextFile(options: {
    suggestedName: string;
    contents: string;
    /** e.g. [{ name: "Shell script", extensions: ["sh"] }] */
    filters?: { name: string; extensions: string[] }[];
  }): Promise<SaveResult>;

  openTextFile(options?: { extensions?: string[] }): Promise<OpenedTextFile | undefined>;

  copyToClipboard(text: string): Promise<void>;
  openExternal(url: string): Promise<void>;

  /** Raw JSON string so the ProfileStore schema stays the single validator. */
  readProfiles(): Promise<string | undefined>;
  writeProfiles(json: string): Promise<void>;

  /**
   * Opens a real interactive shell session — the one deliberate exception to
   * "this app only generates commands, it never executes them" (see the
   * README's amended never-execute claim). Only ever call this when
   * `environment().canRunCommands` is true; `webPlatform`'s implementation
   * rejects unconditionally since a browser tab cannot spawn a process.
   */
  runStart(options: { shellKind: RunShellKind }): Promise<RunSession>;
  /** Writes raw bytes to a live session's stdin — the actually sensitive half of this capability, not `runStart`. */
  runWrite(options: { sessionId: string; data: string }): Promise<void>;
  runResize(options: { sessionId: string; cols: number; rows: number }): Promise<void>;
  runKill(options: { sessionId: string }): Promise<void>;
  /** Subscribes to output for every session in this window; returns an unsubscribe function. */
  onRunData(listener: (event: RunDataEvent) => void): () => void;
}
