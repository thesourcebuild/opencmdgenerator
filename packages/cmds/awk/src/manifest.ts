import type { CommandManifest } from "@cmdgen/engine";

export const AWK_MANIFEST: CommandManifest = {
  id: "awk",
  label: "awk",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Pattern-scanning and text processing — models a core subset (program, files, -F, -v, --posix), not the full awk language.",
  // No win32 — awk has no cmd.exe or PowerShell single-command form by the
  // same name; only ever reached from within a POSIX-capable shell.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
