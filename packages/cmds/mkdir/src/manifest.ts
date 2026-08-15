import type { CommandManifest } from "@cmdgen/engine";

export const MKDIR_MANIFEST: CommandManifest = {
  id: "mkdir",
  label: "mkdir",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Create directories — Linux, macOS, cmd.exe's md, or PowerShell's New-Item.",
  platforms: ["darwin", "linux", "win32"],
  // Same reasoning as @cmdgen/cd — a genuinely different dialect for cmd.exe, not just posix/powershell.
  shells: ["posix", "cmd", "powershell"],
};
