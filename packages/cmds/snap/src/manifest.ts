import type { CommandManifest } from "@cmdgen/engine";

export const SNAP_MANIFEST: CommandManifest = {
  id: "snap",
  label: "snap",
  category: "Package",
  tags: ["Package"],
  summary: "Install and manage snap packages.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
