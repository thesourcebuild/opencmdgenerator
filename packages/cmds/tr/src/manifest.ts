import type { CommandManifest } from "@cmdgen/engine";

export const TR_MANIFEST: CommandManifest = {
  id: "tr",
  label: "tr",
  category: "Text",
  tags: ["Text"],
  summary: "Translate, delete, or squeeze characters from standard input.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
