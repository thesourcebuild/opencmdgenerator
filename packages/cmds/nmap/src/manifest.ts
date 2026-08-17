import type { CommandManifest } from "@cmdgen/engine";

export const NMAP_MANIFEST: CommandManifest = {
  id: "nmap",
  label: "nmap",
  category: "Network",
  tags: ["Network"],
  summary: "Scan hosts and networks.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
