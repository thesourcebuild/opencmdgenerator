import type { CommandManifest } from "@cmdgen/engine";

export const FMT_MANIFEST: CommandManifest = {
  id: "fmt",
  label: "fmt",
  category: "Text",
  tags: ["Text"],
  summary: "Reformat paragraph text.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
