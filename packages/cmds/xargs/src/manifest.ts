import type { CommandManifest } from "@cmdgen/engine";

export const XARGS_MANIFEST: CommandManifest = {
  id: "xargs",
  label: "xargs",
  category: "Text",
  tags: ["Text"],
  summary: "Build and execute command lines from standard input.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
