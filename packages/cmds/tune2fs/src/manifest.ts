import type { CommandManifest } from "@cmdgen/engine";

export const TUNE2FS_MANIFEST: CommandManifest = {
  id: "tune2fs",
  label: "tune2fs",
  category: "Disk",
  tags: ["Disk"],
  summary: "Adjust ext filesystem tunable parameters.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
