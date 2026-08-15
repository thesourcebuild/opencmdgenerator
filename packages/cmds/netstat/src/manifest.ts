import type { CommandManifest } from "@cmdgen/engine";

export const NETSTAT_MANIFEST: CommandManifest = {
  id: "netstat",
  label: "netstat",
  category: "Network",
  tags: ["Network"],
  summary: "List network connections, listening ports, and routing table entries.",
  platforms: ["linux"],
  shells: ["posix"],
};
