import type { CommandManifest } from "@cmdgen/engine";

export const LSMOD_MANIFEST: CommandManifest = {
  id: "lsmod",
  label: "lsmod",
  category: "System",
  tags: ["System"],
  summary: "List loaded Linux kernel modules.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
