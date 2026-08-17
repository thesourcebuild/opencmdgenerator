import type { CommandManifest } from "@cmdgen/engine";

export const STRINGS_MANIFEST: CommandManifest = {
  id: "strings",
  label: "strings",
  category: "Text",
  tags: ["Text"],
  summary: "Print printable strings from files.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
