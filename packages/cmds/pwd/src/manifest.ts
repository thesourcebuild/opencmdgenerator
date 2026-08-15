import type { CommandManifest } from "@cmdgen/engine";

export const PWD_MANIFEST: CommandManifest = {
  id: "pwd",
  label: "pwd",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Navigation"],
  summary: "Print the current working directory — POSIX pwd or PowerShell's Get-Location.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "powershell"],
};
