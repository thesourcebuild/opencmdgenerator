import type { CommandManifest } from "@cmdgen/engine";

export const PSTREE_MANIFEST: CommandManifest = {
  id: "pstree",
  label: "pstree",
  category: "Process",
  tags: ["Process"],
  summary: "Display processes as a tree.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
