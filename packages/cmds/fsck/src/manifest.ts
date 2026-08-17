import type { CommandManifest } from "@cmdgen/engine";

export const FSCK_MANIFEST: CommandManifest = {
  id: "fsck",
  label: "fsck",
  category: "Disk",
  tags: ["Disk"],
  summary: "Check and repair filesystems.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
