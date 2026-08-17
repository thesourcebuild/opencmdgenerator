import type { CommandManifest } from "@cmdgen/engine";

export const GDISK_MANIFEST: CommandManifest = {
  id: "gdisk",
  label: "gdisk",
  category: "Disk",
  tags: ["Disk"],
  summary: "GPT fdisk partitioning tool.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
