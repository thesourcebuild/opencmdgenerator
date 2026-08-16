import type { CommandManifest } from "@cmdgen/engine";

export const EXIT_MANIFEST: CommandManifest = {
  id: "exit",
  label: "exit",
  category: "Shell",
  tags: ["Shell"],
  summary: "Exit the current shell with an optional status code.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
