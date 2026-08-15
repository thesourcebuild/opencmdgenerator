import type { CommandManifest } from "@cmdgen/engine";

export const UNIQ_MANIFEST: CommandManifest = {
  id: "uniq",
  label: "uniq",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Filter or count adjacent matching lines — only removes duplicates that are already next to each other.",
  // No win32 — uniq has no cmd.exe or PowerShell single-command form by the
  // same name; only ever reached from within a POSIX-capable shell.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
