import type { CommandManifest } from "@cmdgen/engine";

export const EGREP_MANIFEST: CommandManifest = {
  id: "egrep",
  label: "egrep",
  category: "Text",
  tags: ["Text"],
  summary: "Search text using extended regular expressions.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
