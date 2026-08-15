import type { CommandManifest } from "@cmdgen/engine";

export const CP_MANIFEST: CommandManifest = {
  id: "cp",
  label: "cp",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Copy files and directories — Linux, macOS, cmd.exe's copy, or PowerShell's Copy-Item.",
  platforms: ["darwin", "linux", "win32"],
  // Same reasoning as @cmdgen/mv — a genuinely different dialect for cmd.exe, though a much narrower one (no recursion, and multiple sources mean something else entirely — see CP004).
  shells: ["posix", "cmd", "powershell"],
};
