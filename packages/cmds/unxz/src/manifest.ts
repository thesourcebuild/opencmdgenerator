import type { CommandManifest } from "@cmdgen/engine";

export const UNXZ_MANIFEST: CommandManifest = {
  id: "unxz",
  label: "unxz",
  category: "Archive",
  tags: ["Archive"],
  summary: "Decompress XZ-compressed files.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
