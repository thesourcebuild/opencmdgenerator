import type { CommandManifest } from "@cmdgen/engine";

export const CMP_MANIFEST: CommandManifest = {
  id: "cmp",
  label: "cmp",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Compare two files byte by byte.",
  // No win32 — fc /B is the closest analog, but that's already @cmdgen/diff's
  // own binaryCmd flag on the same fc binary; a second, overlapping builder
  // for the same tool isn't worth it for a command this rarely reached for
  // directly. Same POSIX-only shape as @cmdgen/chmod/@cmdgen/chown/@cmdgen/less.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
