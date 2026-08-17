import type { CommandManifest } from "@cmdgen/engine";

export const CHKCONFIG_MANIFEST: CommandManifest = {
  id: "chkconfig",
  label: "chkconfig",
  category: "Service",
  tags: ["Service"],
  summary: "Manage SysV service runlevel settings.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
