import type { CommandManifest } from "@cmdgen/engine";

export const ENV_MANIFEST: CommandManifest = {
  id: "env",
  label: "env",
  category: "Shell",
  tags: ["Shell"],
  summary: "Run a command in a modified environment.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
