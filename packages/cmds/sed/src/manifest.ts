import type { CommandManifest } from "@cmdgen/engine";

export const SED_MANIFEST: CommandManifest = {
  id: "sed",
  label: "sed",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Stream editor — s/// substitutions, in-place editing, quiet mode, and multiple -e expressions.",
  // No win32 — sed has no cmd.exe or PowerShell single-command form by the
  // same name; only ever reached from within a POSIX-capable shell.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
