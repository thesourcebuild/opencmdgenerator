import type { CommandManifest } from "@cmdgen/engine";

export const XZ_MANIFEST: CommandManifest = {
  id: "xz",
  label: "xz",
  category: "Archive",
  tags: ["Archive"],
  summary: "Compress files with XZ compression.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
