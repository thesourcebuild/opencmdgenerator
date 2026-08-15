import type { CommandManifest } from "@cmdgen/engine";

export const FDISK_MANIFEST: CommandManifest = {
  id: "fdisk",
  label: "fdisk",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "List partition tables — the safe, read-only form of fdisk this generator supports.",
  // Single-platform per this session's convention — see the identical note
  // in @cmdgen/apt's manifest.
  platforms: ["linux"],
  shells: ["posix"],
};
