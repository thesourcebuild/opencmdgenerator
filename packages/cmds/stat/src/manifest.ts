import type { CommandManifest } from "@cmdgen/engine";

export const STAT_MANIFEST: CommandManifest = {
  id: "stat",
  label: "stat",
  category: "File",
  tags: ["File"],
  summary: "Display detailed file or file system status.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
