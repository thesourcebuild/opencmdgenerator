import type { CommandManifest } from "@cmdgen/engine";

export const DIRNAME_MANIFEST: CommandManifest = {
  id: "dirname",
  label: "dirname",
  category: "File",
  tags: ["File"],
  summary: "Strip the last component from file paths.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
