import type { CommandManifest } from "@cmdgen/engine";

export const W_MANIFEST: CommandManifest = {
  id: "w",
  label: "w",
  category: "User",
  tags: ["User"],
  summary: "Show who is logged in and what they are doing.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
