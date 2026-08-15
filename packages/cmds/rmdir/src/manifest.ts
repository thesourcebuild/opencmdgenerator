import type { CommandManifest } from "@cmdgen/engine";

export const RMDIR_MANIFEST: CommandManifest = {
  id: "rmdir",
  label: "rmdir",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Remove empty directories.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
