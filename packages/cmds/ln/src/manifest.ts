import type { CommandManifest } from "@cmdgen/engine";

export const LN_MANIFEST: CommandManifest = {
  id: "ln",
  label: "ln",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Create hard or symbolic links — Linux, macOS, cmd.exe's mklink, or PowerShell's New-Item.",
  platforms: ["darwin", "linux", "win32"],
  // Same reasoning as @cmdgen/cd and @cmdgen/mkdir — mklink is a genuinely different dialect from posix/powershell.
  shells: ["posix", "cmd", "powershell"],
};
