import type { CommandManifest } from "@cmdgen/engine";

export const LSBLK_MANIFEST: CommandManifest = {
  id: "lsblk",
  label: "lsblk",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "List block devices in a tree, with size, type, and mount point.",
  // lsblk is a Linux (util-linux) tool; no macOS or Windows equivalent by
  // this name — same single-platform shape as @cmdgen/apt.
  platforms: ["linux"],
  shells: ["posix"],
};
