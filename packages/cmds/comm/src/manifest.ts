import type { CommandManifest } from "@cmdgen/engine";

export const COMM_MANIFEST: CommandManifest = {
  id: "comm",
  label: "comm",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Compare two sorted files line by line, showing what's unique to each and what's shared.",
  // No win32 — no builtin or cmdlet does this three-way set comparison at
  // all. Same POSIX-only shape as @cmdgen/cmp/@cmdgen/chmod/@cmdgen/less.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
