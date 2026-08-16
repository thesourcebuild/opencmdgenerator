import type { CommandManifest } from "@cmdgen/engine";

export const PGREP_MANIFEST: CommandManifest = {
  id: "pgrep",
  label: "pgrep",
  category: "Process",
  tags: ["Process"],
  summary: "Look up processes by name and attributes.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
