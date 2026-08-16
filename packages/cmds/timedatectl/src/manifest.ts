import type { CommandManifest } from "@cmdgen/engine";

export const TIMEDATECTL_MANIFEST: CommandManifest = {
  id: "timedatectl",
  label: "timedatectl",
  category: "System",
  tags: ["System"],
  summary: "Control system date, time, and timezone settings.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
