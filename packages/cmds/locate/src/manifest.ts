import type { CommandManifest } from "@cmdgen/engine";

export const LOCATE_MANIFEST: CommandManifest = {
  id: "locate",
  label: "locate",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Search"],
  summary: "Search a prebuilt database of file names — fast, but only as fresh as the last updatedb run.",
  // No win32 — same reasoning as @cmdgen/mount: no Windows-native equivalent at all.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
