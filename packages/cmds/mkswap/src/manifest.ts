import type { CommandManifest } from "@cmdgen/engine";

export const MKSWAP_MANIFEST: CommandManifest = {
  id: "mkswap",
  label: "mkswap",
  category: "Disk",
  tags: ["Disk"],
  summary: "Set up a Linux swap area.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
