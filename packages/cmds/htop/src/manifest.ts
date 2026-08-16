import type { CommandManifest } from "@cmdgen/engine";

export const HTOP_MANIFEST: CommandManifest = {
  id: "htop",
  label: "htop",
  category: "Process",
  tags: ["Process"],
  summary: "Interactive process viewer.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
