import type { CommandManifest } from "@cmdgen/engine";

export const MOUNT_MANIFEST: CommandManifest = {
  id: "mount",
  label: "mount",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Attach a filesystem to the directory tree, or list what's currently mounted.",
  // No win32 — same reasoning as @cmdgen/touch: mount has no Windows-native
  // equivalent by the same name at all ("net use"/drive letters are a
  // fundamentally different concept, not modeled here), and it can never be
  // typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
