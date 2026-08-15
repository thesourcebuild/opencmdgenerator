import type { CommandManifest } from "@cmdgen/engine";

export const YUM_MANIFEST: CommandManifest = {
  id: "yum",
  label: "yum",
  category: "System",
  tags: ["System", "Package Manager"],
  summary: "Install, remove, and search for packages on RHEL, CentOS, and Fedora.",
  // Linux-only — yum is a RHEL/CentOS/Fedora-family tool (superseded by dnf on
  // newer Fedora releases but still widely used and documented). No macOS or
  // Windows equivalent by this name, and no cmd.exe/PowerShell single-command
  // form — same reasoning as @cmdgen/zip's platform restriction.
  platforms: ["linux"],
  shells: ["posix"],
};
