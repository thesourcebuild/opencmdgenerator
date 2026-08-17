import type { CommandManifest } from "@cmdgen/engine";

export const TIMEOUT_MANIFEST: CommandManifest = {
  id: "timeout",
  label: "timeout",
  category: "Shell",
  tags: ["Shell"],
  summary: "Run a command with a time limit.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
