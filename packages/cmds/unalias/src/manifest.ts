import type { CommandManifest } from "@cmdgen/engine";

export const UNALIAS_MANIFEST: CommandManifest = {
  id: "unalias",
  label: "unalias",
  category: "Shell",
  tags: ["Shell"],
  summary: "Remove shell alias definitions.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
