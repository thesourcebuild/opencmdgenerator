import type { CommandManifest } from "@cmdgen/engine";

export const OD_MANIFEST: CommandManifest = {
  id: "od",
  label: "od",
  category: "Text",
  tags: ["Text"],
  summary: "Dump files in octal and other formats.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
