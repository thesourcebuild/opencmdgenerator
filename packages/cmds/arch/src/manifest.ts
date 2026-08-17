import type { CommandManifest } from "@cmdgen/engine";

export const ARCH_MANIFEST: CommandManifest = {
  id: "arch",
  label: "arch",
  category: "System",
  tags: ["System"],
  summary: "Print machine hardware name.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
