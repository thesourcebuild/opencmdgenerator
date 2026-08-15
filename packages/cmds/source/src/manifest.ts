import type { CommandManifest } from "@cmdgen/engine";

export const SOURCE_MANIFEST: CommandManifest = {
  id: "source",
  label: "source",
  category: "Shell",
  tags: ["Shell", "Builtin"],
  summary: "Load and run a script in the current shell — bash's `.`/`source` builtin.",
  platforms: ["linux"],
  shells: ["posix"],
};
