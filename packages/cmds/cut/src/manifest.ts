import type { CommandManifest } from "@cmdgen/engine";

export const CUT_MANIFEST: CommandManifest = {
  id: "cut",
  label: "cut",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Extract selected fields, characters, or byte ranges from each line of text.",
  // No win32 — cut has no cmd.exe or PowerShell single-command form by the
  // same name; only ever reached from within a POSIX-capable shell.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
