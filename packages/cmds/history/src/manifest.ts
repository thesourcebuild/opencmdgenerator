import type { CommandManifest } from "@cmdgen/engine";

export const HISTORY_MANIFEST: CommandManifest = {
  id: "history",
  label: "history",
  category: "Shell",
  tags: ["Shell", "Session"],
  summary: "Show, limit, or clear the shell's command history.",
  // No win32 — same reasoning as @cmdgen/man/@cmdgen/whatis: history is a
  // bash (and zsh) shell builtin, not a standalone binary, with no cmd.exe
  // or PowerShell equivalent by this name at all (PowerShell's own
  // Get-History is a different command, not modeled here).
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
