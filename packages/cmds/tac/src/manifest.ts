import type { CommandManifest } from "@cmdgen/engine";

export const TAC_MANIFEST: CommandManifest = {
  id: "tac",
  label: "tac",
  category: "Text",
  tags: ["Text"],
  summary: "Concatenate and print files in reverse line order.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
