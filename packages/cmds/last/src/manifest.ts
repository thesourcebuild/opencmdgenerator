import type { CommandManifest } from "@cmdgen/engine";

export const LAST_MANIFEST: CommandManifest = {
  id: "last",
  label: "last",
  category: "User",
  tags: ["User"],
  summary: "Show recent login sessions.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
