import type { CommandManifest } from "@cmdgen/engine";

export const LSUSB_MANIFEST: CommandManifest = {
  id: "lsusb",
  label: "lsusb",
  category: "System",
  tags: ["System"],
  summary: "List USB devices.",
  platforms: ["linux"],
  shells: ["posix"],
};
