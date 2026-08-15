import type { CommandManifest } from "@cmdgen/engine";

export const CAT_MANIFEST: CommandManifest = {
  id: "cat",
  label: "cat",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Text"],
  summary: "Print file contents — Linux, macOS, cmd.exe's type, or PowerShell's Get-Content.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "cmd", "powershell"],
};
