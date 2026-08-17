import type { CommandManifest } from "@cmdgen/engine";

export const LASTLOG_MANIFEST: CommandManifest = {
  id: "lastlog",
  label: "lastlog",
  category: "User",
  tags: ["User"],
  summary: "Show the most recent login of users.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
