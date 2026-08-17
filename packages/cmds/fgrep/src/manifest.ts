import type { CommandManifest } from "@cmdgen/engine";

export const FGREP_MANIFEST: CommandManifest = {
  id: "fgrep",
  label: "fgrep",
  category: "Text",
  tags: ["Text"],
  summary: "Search fixed strings in files.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
