import type { CommandManifest } from "@cmdgen/engine";

export const RPM_MANIFEST: CommandManifest = {
  id: "rpm",
  label: "rpm",
  category: "System",
  tags: ["System", "Package Manager"],
  summary: "Install, remove, and query RPM packages directly — the low-level tool underlying yum and dnf.",
  // Linux-only — rpm is the low-level package tool on RHEL/Fedora-family
  // systems; no macOS or Windows equivalent by this name.
  platforms: ["linux"],
  shells: ["posix"],
};
