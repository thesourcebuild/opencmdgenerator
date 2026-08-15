import type { CommandManifest } from "@cmdgen/engine";

export const MKFS_MANIFEST: CommandManifest = {
  id: "mkfs",
  label: "mkfs",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Format a device with a new filesystem — always destructive to whatever was there before.",
  // Single-platform per this session's convention — see the identical note
  // in @cmdgen/apt's manifest.
  platforms: ["linux"],
  shells: ["posix"],
};
