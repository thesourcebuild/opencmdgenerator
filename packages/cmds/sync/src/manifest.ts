import type { CommandManifest } from "@cmdgen/engine";

export const SYNC_MANIFEST: CommandManifest = {
  id: "sync",
  label: "sync",
  category: "Disk",
  tags: ["Disk"],
  summary: "Flush filesystem buffers.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
