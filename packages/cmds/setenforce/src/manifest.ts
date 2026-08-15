import type { CommandManifest } from "@cmdgen/engine";

export const SETENFORCE_MANIFEST: CommandManifest = {
  id: "setenforce",
  label: "setenforce",
  category: "System",
  tags: ["System", "Security", "SELinux"],
  summary: "Switch SELinux between Enforcing and Permissive mode.",
  // SELinux is a Linux-only kernel security module — no macOS or Windows
  // equivalent by this name at all, same genuinely-single-platform shape as
  // @cmdgen/iptables.
  platforms: ["linux"],
  shells: ["posix"],
};
