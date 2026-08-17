import type { CommandManifest } from "@cmdgen/engine";

export const SEVENZ_MANIFEST: CommandManifest = {
  id: "7z",
  label: "7z",
  category: "Archive",
  tags: ["Archive"],
  summary: "Create and extract 7-Zip archives.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
