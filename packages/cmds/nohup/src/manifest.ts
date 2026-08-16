import type { CommandManifest } from "@cmdgen/engine";

export const NOHUP_MANIFEST: CommandManifest = {
  id: "nohup",
  label: "nohup",
  category: "Process",
  tags: ["Process"],
  summary: "Run a command immune to hangups.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
