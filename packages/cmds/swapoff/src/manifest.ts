import type { CommandManifest } from "@cmdgen/engine";

export const SWAPOFF_MANIFEST: CommandManifest = {
  id: "swapoff",
  label: "swapoff",
  category: "Disk",
  tags: ["Disk"],
  summary: "Disable swap devices and files.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
