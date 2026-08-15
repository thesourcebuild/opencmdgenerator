import type { CommandManifest } from "@cmdgen/engine";

export const UFW_MANIFEST: CommandManifest = {
  id: "ufw",
  label: "ufw",
  category: "System",
  tags: ["System", "Network"],
  summary: "Manage the Uncomplicated Firewall — enable/disable it, or allow/deny specific ports.",
  // ufw is a Debian/Ubuntu-family tool; no macOS or Windows equivalent by
  // this name — same single-platform shape as @cmdgen/apt.
  platforms: ["linux"],
  shells: ["posix"],
};
