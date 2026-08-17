import type { CommandManifest } from "@cmdgen/engine";

export const BASENAME_MANIFEST: CommandManifest = {
  id: "basename",
  label: "basename",
  category: "File",
  tags: ["File"],
  summary: "Strip directory and suffix from filenames.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
