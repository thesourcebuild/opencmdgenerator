import type { CommandManifest } from "@cmdgen/engine";

export const BLKID_MANIFEST: CommandManifest = {
  id: "blkid",
  label: "blkid",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Report UUIDs, labels, and filesystem types of block devices.",
  // blkid is a Linux (util-linux) tool; no macOS or Windows equivalent by
  // this name — same single-platform shape as @cmdgen/apt.
  platforms: ["linux"],
  shells: ["posix"],
};
