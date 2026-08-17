import type { CommandManifest } from "@cmdgen/engine";

export const PARTED_MANIFEST: CommandManifest = {
  id: "parted",
  label: "parted",
  category: "Disk",
  tags: ["Disk"],
  summary: "Partition manipulation program.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
