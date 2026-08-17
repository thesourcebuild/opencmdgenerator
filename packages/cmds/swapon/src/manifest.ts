import type { CommandManifest } from "@cmdgen/engine";

export const SWAPON_MANIFEST: CommandManifest = {
  id: "swapon",
  label: "swapon",
  category: "Disk",
  tags: ["Disk"],
  summary: "Enable swap devices and files.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
