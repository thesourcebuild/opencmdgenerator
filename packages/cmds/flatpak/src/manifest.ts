import type { CommandManifest } from "@cmdgen/engine";

export const FLATPAK_MANIFEST: CommandManifest = {
  id: "flatpak",
  label: "flatpak",
  category: "Package",
  tags: ["Package"],
  summary: "Install and manage Flatpak applications.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
