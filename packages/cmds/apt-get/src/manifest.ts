import type { CommandManifest } from "@cmdgen/engine";

export const APT_GET_MANIFEST: CommandManifest = {
  id: "apt-get",
  label: "apt-get",
  category: "System",
  tags: ["System", "Package Manager"],
  summary: "Install, remove, and manage packages on Debian and Ubuntu — apt's older, script-oriented ancestor.",
  // apt-get is a Debian/Ubuntu-family tool; no macOS or Windows equivalent by
  // this name — the same genuinely single-platform shape as `@cmdgen/apt`.
  platforms: ["linux"],
  shells: ["posix"],
};
