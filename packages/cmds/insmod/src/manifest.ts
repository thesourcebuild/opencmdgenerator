import type { CommandManifest } from "@cmdgen/engine";

export const INSMOD_MANIFEST: CommandManifest = {
  id: "insmod",
  label: "insmod",
  category: "System",
  tags: ["System"],
  summary: "Insert a Linux kernel module file.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
