import type { CommandManifest } from "@cmdgen/engine";

export const PING_MANIFEST: CommandManifest = {
  id: "ping",
  label: "ping",
  category: "Network",
  tags: ["Network"],
  summary: "Send ICMP echo requests to a host to check reachability and round-trip time.",
  platforms: ["linux"],
  shells: ["posix"],
};
