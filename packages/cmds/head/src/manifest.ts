import type { CommandManifest } from "@cmdgen/engine";

export const HEAD_MANIFEST: CommandManifest = {
  id: "head",
  label: "head",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Print the first part of files — POSIX head or PowerShell's Get-Content -TotalCount.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "powershell"],
};
