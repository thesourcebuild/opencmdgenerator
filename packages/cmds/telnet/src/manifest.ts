import type { CommandManifest } from "@cmdgen/engine";

export const TELNET_MANIFEST: CommandManifest = {
  id: "telnet",
  label: "telnet",
  category: "Network",
  tags: ["Network"],
  summary: "Connect to a host using the Telnet protocol.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
