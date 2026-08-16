import type { CommandManifest } from "@cmdgen/engine";

export const FINGER_MANIFEST: CommandManifest = {
  id: "finger",
  label: "finger",
  category: "User",
  tags: ["User"],
  summary: "Display information about local or remote users.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
