import type { CommandManifest } from "@cmdgen/engine";

export const FILE_MANIFEST: CommandManifest = {
  id: "file",
  label: "file",
  category: "File",
  tags: ["File"],
  summary: "Determine file types.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
