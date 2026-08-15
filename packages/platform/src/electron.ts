import type {
  OpenedTextFile,
  PlatformApi,
  PlatformEnvironment,
  RunDataEvent,
  RunSession,
  RunShellKind,
  SaveResult,
} from "@cmdgen/contracts";
import { getDesktopBridge } from "./bridge";

function bridge() {
  const b = getDesktopBridge();
  if (!b) throw new Error("Desktop bridge unavailable — this is not the Electron renderer.");
  return b;
}

/**
 * Electron adapter. This is the ONLY module in the repo that talks to the
 * desktop bridge; nothing in packages/ui or packages/features may reach past it.
 * Note it still does not import `electron` — the preload script owns that, and
 * the renderer stays sandboxed.
 */
export const electronPlatform: PlatformApi = {
  async environment(): Promise<PlatformEnvironment> {
    const b = bridge();
    const isWindows = b.platform === "win32";
    const isLinux = b.platform === "linux";
    // Mac isn't included yet — no packaging/CI has ever exercised node-pty's
    // native binary for a mac.target build. Windows and Linux both have a
    // real, tested electron-builder target (nsis; AppImage/deb) and a real
    // shell `resolveShell` in apps/desktop/src/main/run.ts knows how to spawn.
    const runnableShellKinds: RunShellKind[] = isWindows
      ? ["cmd", "powershell", "wsl"]
      : isLinux
        ? ["bash"]
        : [];
    return {
      isDesktop: true,
      platform: b.platform,
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? (await b.getVersion()),
      defaultShell: isWindows ? "powershell" : "posix",
      defaultPathFlavor: isWindows ? "cygwin" : "unix",
      canPickDirectories: true,
      canRunCommands: isWindows || isLinux,
      runnableShellKinds,
    };
  },

  async pickDirectory(options): Promise<string | undefined> {
    return (await bridge().pickDirectory(options)) ?? undefined;
  },

  async pickFile(options): Promise<string | undefined> {
    return (await bridge().pickFile(options)) ?? undefined;
  },

  async saveTextFile(options): Promise<SaveResult> {
    return bridge().saveTextFile(options);
  },

  async openTextFile(options): Promise<OpenedTextFile | undefined> {
    return (await bridge().openTextFile(options)) ?? undefined;
  },

  async copyToClipboard(text: string): Promise<void> {
    // The renderer is a real Chromium context, so the async clipboard API works
    // without a privileged round-trip.
    await navigator.clipboard.writeText(text);
  },

  async openExternal(url: string): Promise<void> {
    await bridge().openExternal(url);
  },

  async readProfiles(): Promise<string | undefined> {
    return (await bridge().readProfiles()) ?? undefined;
  },

  async writeProfiles(json: string): Promise<void> {
    await bridge().writeProfiles(json);
  },

  async runStart(options): Promise<RunSession> {
    return bridge().runStart(options);
  },

  async runWrite(options): Promise<void> {
    await bridge().runWrite(options);
  },

  async runResize(options): Promise<void> {
    await bridge().runResize(options);
  },

  async runKill(options): Promise<void> {
    await bridge().runKill(options);
  },

  onRunData(listener: (event: RunDataEvent) => void): () => void {
    return bridge().onRunData(listener);
  },
};
