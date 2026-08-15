import type { CommandManifest } from "@cmdgen/engine";

export const PACMAN_MANIFEST: CommandManifest = {
  id: "pacman",
  label: "pacman",
  category: "System",
  tags: ["System", "Package Manager"],
  summary: "Install, remove, and search for packages on Arch Linux.",
  // pacman is Arch Linux's package manager; there is no macOS or Windows
  // equivalent by this name.
  platforms: ["linux"],
  shells: ["posix"],
};
