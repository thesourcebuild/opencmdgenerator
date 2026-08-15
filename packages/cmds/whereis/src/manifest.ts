import type { CommandManifest } from "@cmdgen/engine";

export const WHEREIS_MANIFEST: CommandManifest = {
  id: "whereis",
  label: "whereis",
  category: "Shell",
  tags: ["Shell", "Documentation"],
  summary: "Locate a command's binary, source, and manual page files.",
  // No win32 — same reasoning as @cmdgen/killall: whereis has no cmd.exe or
  // PowerShell single-command equivalent at all, and it can never be typed
  // into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
