import type { CommandManifest } from "@cmdgen/engine";

/** Cheap metadata — safe to bundle eagerly alongside every other installed command. */
export const RSYNC_MANIFEST: CommandManifest = {
  id: "rsync",
  label: "rsync",
  category: "File Transfer",
  tags: ["File Transfer", "Sync", "Remote", "SSH"],
  summary: "Fast, versatile file-copying tool for local and remote transfers.",
  // No native Windows build — a Windows target means cwRsync/MSYS2/WSL, not a bare install.
  // Once installed, the binary itself doesn't care which shell invoked it.
  platforms: ["darwin", "linux", "win32"],
  platformNotes: { win32: "No native build — via cwRsync, MSYS2, or WSL, not bundled with Windows." },
  shells: ["posix", "cmd", "powershell"],
};
