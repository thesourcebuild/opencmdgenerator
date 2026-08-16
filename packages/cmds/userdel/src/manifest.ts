import type { CommandManifest } from "@cmdgen/engine";

export const USERDEL_MANIFEST: CommandManifest = {
  id: "userdel",
  label: "userdel",
  category: "User",
  tags: ["User"],
  summary: "Delete a user account.",
  platforms: ["linux"],
  shells: ["posix"],
};
