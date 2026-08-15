import type { CommandManifest } from "@cmdgen/engine";

export const CD_MANIFEST: CommandManifest = {
  id: "cd",
  label: "cd",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Navigation"],
  summary: "Change the current working directory — Linux, macOS, cmd.exe or PowerShell.",
  platforms: ["darwin", "linux", "win32"],
  // The one command in this set that renders a genuinely different dialect for cmd.exe, not just posix/powershell.
  shells: ["posix", "cmd", "powershell"],
};
