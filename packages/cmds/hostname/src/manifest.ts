import type { CommandManifest } from "@cmdgen/engine";

export const HOSTNAME_MANIFEST: CommandManifest = {
  id: "hostname",
  label: "hostname",
  category: "System",
  tags: ["System"],
  summary: "Show or set the system host name.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
