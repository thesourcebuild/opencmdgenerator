import type { CommandManifest } from "@cmdgen/engine";

export const SEMANAGE_MANIFEST: CommandManifest = {
  id: "semanage",
  label: "semanage",
  category: "System",
  tags: ["System", "Security", "SELinux"],
  summary:
    "Manage SELinux policy customizations — scoped here to file context (fcontext) and port labeling, the two most common object types; semanage's full surface also covers users, logins, booleans, and modules.",
  // SELinux is a Linux-only kernel security module — no macOS or Windows
  // equivalent by this name at all, same genuinely-single-platform shape as
  // @cmdgen/iptables.
  platforms: ["linux"],
  shells: ["posix"],
};
