import type { CommandManifest } from "@cmdgen/engine";

export const E2FSCK_MANIFEST: CommandManifest = {
  id: "e2fsck",
  label: "e2fsck",
  category: "Disk",
  tags: ["Disk"],
  summary: "Check ext2/ext3/ext4 filesystems.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
