import type { CommandManifest } from "@cmdgen/engine";

export const MAN_MANIFEST: CommandManifest = {
  id: "man",
  label: "man",
  category: "Shell",
  tags: ["Shell", "Documentation"],
  summary: "Display the manual page for a command or topic.",
  // No win32 — same reasoning as @cmdgen/killall: man has no cmd.exe or
  // PowerShell single-command form by this name at all (`Get-Help` is a
  // different tool with a different name, not modeled here), and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
