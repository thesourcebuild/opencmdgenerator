import type { CommandManifest } from "@cmdgen/engine";

export const WATCH_MANIFEST: CommandManifest = {
  id: "watch",
  label: "watch",
  category: "Shell",
  tags: ["Shell"],
  summary: "Run a command periodically and display its output.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
