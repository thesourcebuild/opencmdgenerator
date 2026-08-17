import type { CommandManifest } from "@cmdgen/engine";

export const DISOWN_MANIFEST: CommandManifest = {
  id: "disown",
  label: "disown",
  category: "Shell",
  tags: ["Shell"],
  summary: "Remove jobs from the shell job table.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
