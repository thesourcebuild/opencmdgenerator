import type { CommandManifest } from "@cmdgen/engine";

export const ID_MANIFEST: CommandManifest = {
  id: "id",
  label: "id",
  category: "User",
  tags: ["User"],
  summary: "Print user and group identity information.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
