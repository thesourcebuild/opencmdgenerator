import type { CommandManifest } from "@cmdgen/engine";

export const DPKG_MANIFEST: CommandManifest = {
  id: "dpkg",
  label: "dpkg",
  category: "Package",
  tags: ["Package"],
  summary: "Debian package manager.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
