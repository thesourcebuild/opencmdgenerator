import type { CommandManifest } from "@cmdgen/engine";

export const IPTABLES_MANIFEST: CommandManifest = {
  id: "iptables",
  label: "iptables",
  category: "System",
  tags: ["System", "Network"],
  summary: "Configure low-level Linux firewall rules — append, insert, or delete packet-filtering rules.",
  // iptables is a Linux-only tool — no macOS equivalent by this name at all
  // (macOS uses the unrelated `pfctl`), and no Windows equivalent either.
  // Same genuinely-single-platform shape as @cmdgen/apt.
  platforms: ["linux"],
  shells: ["posix"],
};
