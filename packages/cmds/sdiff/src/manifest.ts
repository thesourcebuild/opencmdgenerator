import type { CommandManifest } from "@cmdgen/engine";

export const SDIFF_MANIFEST: CommandManifest = {
  id: "sdiff",
  label: "sdiff",
  category: "Text",
  tags: ["Text"],
  summary: "Side-by-side merge and comparison tool.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
