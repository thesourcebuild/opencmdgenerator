import type { CommandManifest } from "@cmdgen/engine";

export const GROUPDEL_MANIFEST: CommandManifest = {
  id: "groupdel",
  label: "groupdel",
  category: "User",
  tags: ["User"],
  summary: "Delete a group account.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
