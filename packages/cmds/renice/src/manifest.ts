import type { CommandManifest } from "@cmdgen/engine";

export const RENICE_MANIFEST: CommandManifest = {
  id: "renice",
  label: "renice",
  category: "Process",
  tags: ["Process"],
  summary: "Alter priority of running processes.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
