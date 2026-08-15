import type { CommandManifest } from "@cmdgen/engine";

export const WC_MANIFEST: CommandManifest = {
  id: "wc",
  label: "wc",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Count lines, words, bytes, or characters in text.",
  // No win32 — wc has no cmd.exe or PowerShell single-command form by the
  // same name; only ever reached from within a POSIX-capable shell.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
