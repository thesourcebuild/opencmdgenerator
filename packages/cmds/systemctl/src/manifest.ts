import type { CommandManifest } from "@cmdgen/engine";

export const SYSTEMCTL_MANIFEST: CommandManifest = {
  id: "systemctl",
  label: "systemctl",
  category: "System",
  tags: ["System"],
  summary: "Start, stop, enable, disable, or check the status of a systemd unit.",
  // Linux only — systemd has no macOS or Windows equivalent.
  platforms: ["linux"],
  shells: ["posix"],
};
