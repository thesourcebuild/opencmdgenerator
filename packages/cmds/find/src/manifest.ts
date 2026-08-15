import type { CommandManifest } from "@cmdgen/engine";

export const FIND_MANIFEST: CommandManifest = {
  id: "find",
  label: "find",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Search"],
  summary: "Search a directory tree for files matching criteria, optionally acting on each match.",
  // No win32 — same reasoning as @cmdgen/mount: no Windows-native equivalent at all.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
