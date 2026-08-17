import type { CommandManifest } from "@cmdgen/engine";

export const CHSH_MANIFEST: CommandManifest = {
  id: "chsh",
  label: "chsh",
  category: "User",
  tags: ["User"],
  summary: "Change a user's login shell.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
