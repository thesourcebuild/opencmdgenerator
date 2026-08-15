import type { CommandManifest } from "@cmdgen/engine";

export const FIREWALL_CMD_MANIFEST: CommandManifest = {
  id: "firewall-cmd",
  label: "firewall-cmd",
  category: "System",
  tags: ["System", "Network", "Firewall"],
  summary: "Manage the firewalld dynamic firewall — check state, list rules, open/close ports and services, reload, or panic.",
  // firewalld is a Linux tool (RHEL/Fedora-family and beyond); no macOS or
  // Windows equivalent by this name — same single-platform shape as
  // @cmdgen/ufw.
  platforms: ["linux"],
  shells: ["posix"],
};
