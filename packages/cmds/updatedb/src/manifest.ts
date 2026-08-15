import type { CommandManifest } from "@cmdgen/engine";

export const UPDATEDB_MANIFEST: CommandManifest = {
  id: "updatedb",
  label: "updatedb",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Search"],
  summary: "Rebuild the database that locate searches.",
  // No win32 — same reasoning as @cmdgen/mount: no Windows-native equivalent at all.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
