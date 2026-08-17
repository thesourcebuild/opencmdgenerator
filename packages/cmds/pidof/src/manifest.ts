import type { CommandManifest } from "@cmdgen/engine";

export const PIDOF_MANIFEST: CommandManifest = {
  id: "pidof",
  label: "pidof",
  category: "Process",
  tags: ["Process"],
  summary: "Find process IDs by program name.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
