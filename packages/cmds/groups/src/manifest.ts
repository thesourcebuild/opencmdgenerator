import type { CommandManifest } from "@cmdgen/engine";

export const GROUPS_MANIFEST: CommandManifest = {
  id: "groups",
  label: "groups",
  category: "User",
  tags: ["User"],
  summary: "Print group memberships.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
