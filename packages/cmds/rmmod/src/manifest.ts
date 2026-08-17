import type { CommandManifest } from "@cmdgen/engine";

export const RMMOD_MANIFEST: CommandManifest = {
  id: "rmmod",
  label: "rmmod",
  category: "System",
  tags: ["System"],
  summary: "Remove Linux kernel modules.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
