import type { CommandManifest } from "@cmdgen/engine";

export const IWCONFIG_MANIFEST: CommandManifest = {
  id: "iwconfig",
  label: "iwconfig",
  category: "Network",
  tags: ["Network"],
  summary: "Configure wireless network interfaces.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
