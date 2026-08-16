import type { CommandManifest } from "@cmdgen/engine";

export const PASTE_MANIFEST: CommandManifest = {
  id: "paste",
  label: "paste",
  category: "Text",
  tags: ["Text"],
  summary: "Merge lines of files side by side or serially.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
