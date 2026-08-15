import type { CommandManifest } from "@cmdgen/engine";

export const VI_MANIFEST: CommandManifest = {
  id: "vi",
  label: "vi",
  category: "Shell",
  tags: ["Shell", "Text", "Editor"],
  summary: "Open file(s) in the vi editor — with an optional read-only mode and starting line.",
  platforms: ["linux"],
  shells: ["posix"],
};
