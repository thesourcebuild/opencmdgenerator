import type { CommandManifest } from "@cmdgen/engine";

export const MORE_MANIFEST: CommandManifest = {
  id: "more",
  label: "more",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Page through a file's contents, one screen at a time — less's simpler ancestor.",
  platforms: ["linux"],
  shells: ["posix"],
};
