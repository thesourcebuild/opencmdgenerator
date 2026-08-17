import type { CommandManifest } from "@cmdgen/engine";

export const JOIN_MANIFEST: CommandManifest = {
  id: "join",
  label: "join",
  category: "Text",
  tags: ["Text"],
  summary: "Join lines of two files on a common field.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
