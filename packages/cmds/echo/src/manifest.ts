import type { CommandManifest } from "@cmdgen/engine";

export const ECHO_MANIFEST: CommandManifest = {
  id: "echo",
  label: "echo",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Print a line of text — bash/zsh builtin, cmd.exe's echo, or PowerShell's Write-Output/Write-Host.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "cmd", "powershell"],
};
