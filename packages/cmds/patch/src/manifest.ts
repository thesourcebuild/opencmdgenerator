import type { CommandManifest } from "@cmdgen/engine";

export const PATCH_MANIFEST: CommandManifest = {
  id: "patch",
  label: "patch",
  category: "Shell",
  tags: ["Shell", "Files"],
  summary: "Apply a diff to a file.",
  // No win32 — same reasoning as @cmdgen/mount: no Windows-native equivalent at all.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
