import type { CommandManifest } from "@cmdgen/engine";

export const MODPROBE_MANIFEST: CommandManifest = {
  id: "modprobe",
  label: "modprobe",
  category: "System",
  tags: ["System"],
  summary: "Add or remove Linux kernel modules.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
