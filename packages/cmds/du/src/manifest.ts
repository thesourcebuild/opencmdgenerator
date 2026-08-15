import type { CommandManifest } from "@cmdgen/engine";

export const DU_MANIFEST: CommandManifest = {
  id: "du",
  label: "du",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Report disk usage for files and directories.",
  // Single-platform per this session's convention — see the identical note
  // in @cmdgen/apt's manifest.
  platforms: ["linux"],
  shells: ["posix"],
};
