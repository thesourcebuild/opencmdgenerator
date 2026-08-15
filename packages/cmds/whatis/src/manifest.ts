import type { CommandManifest } from "@cmdgen/engine";

export const WHATIS_MANIFEST: CommandManifest = {
  id: "whatis",
  label: "whatis",
  category: "Shell",
  tags: ["Shell", "Documentation"],
  summary: "Show a one-line description of a command from its manual page.",
  // No win32 — same reasoning as @cmdgen/killall: whatis has no cmd.exe or
  // PowerShell equivalent at all, and it can never be typed into a bare
  // cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
