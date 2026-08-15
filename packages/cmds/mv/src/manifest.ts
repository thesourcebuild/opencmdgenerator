import type { CommandManifest } from "@cmdgen/engine";

export const MV_MANIFEST: CommandManifest = {
  id: "mv",
  label: "mv",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Move or rename files and directories — Linux, macOS, cmd.exe's move, or PowerShell's Move-Item.",
  platforms: ["darwin", "linux", "win32"],
  // Same reasoning as @cmdgen/cd/@cmdgen/mkdir/@cmdgen/ln — a genuinely different dialect for cmd.exe.
  shells: ["posix", "cmd", "powershell"],
};
