import type { CommandManifest } from "@cmdgen/engine";

export const JOURNALCTL_MANIFEST: CommandManifest = {
  id: "journalctl",
  label: "journalctl",
  category: "System",
  tags: ["System", "Read-only"],
  summary: "Read and filter the systemd journal — by unit, priority, boot, or time range.",
  // Linux only — the systemd journal has no macOS or Windows equivalent.
  platforms: ["linux"],
  shells: ["posix"],
};
