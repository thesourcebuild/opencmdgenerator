import type { CommandManifest } from "@cmdgen/engine";

export const BUNZIP2_MANIFEST: CommandManifest = {
  id: "bunzip2",
  label: "bunzip2",
  category: "Archive",
  tags: ["Archive"],
  summary: "Decompress bzip2 files.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
