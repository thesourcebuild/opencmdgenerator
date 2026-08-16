import type { CommandManifest } from "@cmdgen/engine";

export const BZIP2_MANIFEST: CommandManifest = {
  id: "bzip2",
  label: "bzip2",
  category: "Archive",
  tags: ["Archive"],
  summary: "Compress files using bzip2.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
