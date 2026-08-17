import type { CommandManifest } from "@cmdgen/engine";

export const APT_CACHE_MANIFEST: CommandManifest = {
  id: "apt-cache",
  label: "apt-cache",
  category: "Package",
  tags: ["Package"],
  summary: "Query APT package metadata.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
