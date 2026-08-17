import type { CommandManifest } from "@cmdgen/engine";

export const NL_MANIFEST: CommandManifest = {
  id: "nl",
  label: "nl",
  category: "Text",
  tags: ["Text"],
  summary: "Number lines of files.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
