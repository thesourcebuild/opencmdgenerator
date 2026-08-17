import type { CommandManifest } from "@cmdgen/engine";

export const WHO_MANIFEST: CommandManifest = {
  id: "who",
  label: "who",
  category: "User",
  tags: ["User"],
  summary: "Show who is logged in.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
