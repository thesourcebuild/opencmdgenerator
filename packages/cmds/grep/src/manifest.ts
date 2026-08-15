import type { CommandManifest } from "@cmdgen/engine";

export const GREP_MANIFEST: CommandManifest = {
  id: "grep",
  label: "grep",
  category: "Shell",
  tags: ["Shell", "Text", "Search"],
  summary: "Search text by pattern — Linux, macOS, cmd.exe's findstr, or PowerShell's Select-String.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "cmd", "powershell"],
};
