import type { CommandManifest } from "@cmdgen/engine";

export const HEXDUMP_MANIFEST: CommandManifest = {
  id: "hexdump",
  label: "hexdump",
  category: "Text",
  tags: ["Text"],
  summary: "Display file contents in hexadecimal.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
