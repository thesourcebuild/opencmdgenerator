import type { CommandManifest } from "@cmdgen/engine";

export const LSHW_MANIFEST: CommandManifest = {
  id: "lshw",
  label: "lshw",
  category: "System",
  tags: ["System"],
  summary: "Display detailed hardware information.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
