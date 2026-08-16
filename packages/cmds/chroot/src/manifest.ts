import type { CommandManifest } from "@cmdgen/engine";

export const CHROOT_MANIFEST: CommandManifest = {
  id: "chroot",
  label: "chroot",
  category: "System",
  tags: ["System"],
  summary: "Run a command with a different root directory.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
