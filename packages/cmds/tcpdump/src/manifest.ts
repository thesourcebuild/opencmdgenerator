import type { CommandManifest } from "@cmdgen/engine";

export const TCPDUMP_MANIFEST: CommandManifest = {
  id: "tcpdump",
  label: "tcpdump",
  category: "Network",
  tags: ["Network"],
  summary: "Capture and inspect network packets.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
