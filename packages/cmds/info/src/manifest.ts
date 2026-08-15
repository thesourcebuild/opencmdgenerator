import type { CommandManifest } from "@cmdgen/engine";

export const INFO_MANIFEST: CommandManifest = {
  id: "info",
  label: "info",
  category: "Shell",
  tags: ["Shell", "Documentation"],
  summary: "Browse the GNU Info documentation reader for a command or topic.",
  // No win32 — same reasoning as @cmdgen/man/@cmdgen/whatis: info has no
  // cmd.exe or PowerShell equivalent by this name at all, and it can never
  // be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
