import type { CommandManifest } from "@cmdgen/engine";

export const GETENFORCE_MANIFEST: CommandManifest = {
  id: "getenforce",
  label: "getenforce",
  category: "System",
  tags: ["System", "Security", "SELinux"],
  summary: "Print the current SELinux mode — Enforcing, Permissive, or Disabled.",
  // SELinux is a Linux-only kernel security module — no macOS or Windows
  // equivalent by this name at all, same genuinely-single-platform shape as
  // @cmdgen/iptables.
  platforms: ["linux"],
  shells: ["posix"],
};
