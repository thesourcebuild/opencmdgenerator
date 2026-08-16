import type { CommandManifest } from "@cmdgen/engine";

export const HWINFO_MANIFEST: CommandManifest = {
  id: "hwinfo",
  label: "hwinfo",
  category: "System",
  tags: ["System"],
  summary: "Display detailed hardware probing information.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
