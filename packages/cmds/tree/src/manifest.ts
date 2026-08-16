import type { CommandManifest } from "@cmdgen/engine";

export const TREE_MANIFEST: CommandManifest = {
  id: "tree",
  label: "tree",
  category: "File",
  tags: ["File"],
  summary: "Display directory contents as a visual tree.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
