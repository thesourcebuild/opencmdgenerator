import type { CommandManifest } from "@cmdgen/engine";

export const TRACEROUTE_MANIFEST: CommandManifest = {
  id: "traceroute",
  label: "traceroute",
  category: "Network",
  tags: ["Network"],
  summary: "Trace the network path packets take to a host — traceroute on Linux/macOS, tracert on Windows.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "cmd", "powershell"],
};
