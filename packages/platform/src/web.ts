import type {
  OpenedTextFile,
  PlatformApi,
  PlatformEnvironment,
  RunDataEvent,
  RunSession,
  SaveResult,
} from "@cmdgen/contracts";

/** A browser tab cannot spawn a process — `canRunCommands` is always false here, so none of these should ever actually be called. */
function runUnsupported(): never {
  throw new Error("Running commands is only available in the desktop app.");
}

const PROFILE_KEY = "OpenCmdGenerator:profiles:v1";

/**
 * Browser adapter. A web page cannot read a real filesystem path, so directory
 * picking is genuinely unavailable here — the builder falls back to a text
 * input, and `canPickDirectories` tells the UI to say so rather than offering a
 * button that does nothing.
 */
export const webPlatform: PlatformApi = {
  async environment(): Promise<PlatformEnvironment> {
    const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
    const isWindows = /Windows/i.test(ua);
    return {
      isDesktop: false,
      platform: "browser",
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
      // A browser user is most likely writing a command for their own machine.
      defaultShell: isWindows ? "powershell" : "posix",
      defaultPathFlavor: isWindows ? "cygwin" : "unix",
      canPickDirectories: false,
      canRunCommands: false,
      runnableShellKinds: [],
    };
  },

  async pickDirectory(): Promise<string | undefined> {
    // showDirectoryPicker() yields a handle, not a path. rsync needs a path, so
    // there is nothing useful to return; the UI keeps its text input instead.
    return undefined;
  },

  async pickFile(): Promise<string | undefined> {
    return undefined;
  },

  async saveTextFile({ suggestedName, contents }): Promise<SaveResult> {
    const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = suggestedName;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      return { saved: true };
    } finally {
      URL.revokeObjectURL(url);
    }
  },

  async openTextFile({ extensions } = {}): Promise<OpenedTextFile | undefined> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      if (extensions?.length) input.accept = extensions.map((e) => `.${e}`).join(",");
      input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) return resolve(undefined);
        void file.text().then((contents) => resolve({ name: file.name, contents }));
      });
      // A cancelled dialog fires no event in some browsers; resolve on blur.
      input.addEventListener("cancel", () => resolve(undefined));
      input.click();
    });
  },

  async copyToClipboard(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
  },

  async openExternal(url: string): Promise<void> {
    window.open(url, "_blank", "noopener,noreferrer");
  },

  async readProfiles(): Promise<string | undefined> {
    try {
      const current = window.localStorage.getItem(PROFILE_KEY);
      return current ?? undefined;
    } catch {
      // Private browsing modes can throw on localStorage access.
      return undefined;
    }
  },

  async writeProfiles(json: string): Promise<void> {
    try {
      window.localStorage.setItem(PROFILE_KEY, json);
    } catch {
      // Nothing to do: profiles are a convenience, not the product.
    }
  },

  async runStart(): Promise<RunSession> {
    runUnsupported();
  },
  async runWrite(): Promise<void> {
    runUnsupported();
  },
  async runResize(): Promise<void> {
    runUnsupported();
  },
  async runKill(): Promise<void> {
    runUnsupported();
  },
  onRunData(_listener: (event: RunDataEvent) => void): () => void {
    runUnsupported();
  },
};
