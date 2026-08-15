import type { CommandManifest } from "@cmdgen/engine";

export const UMOUNT_MANIFEST: CommandManifest = {
  id: "umount",
  label: "umount",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Detach a mounted filesystem from the directory tree.",
  // No win32 — same reasoning as @cmdgen/mount: umount has no Windows-native
  // equivalent by the same name at all, and can never be typed into a bare
  // cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
