import type { CommandManifest } from "@cmdgen/engine";

export const TAIL_MANIFEST: CommandManifest = {
  id: "tail",
  label: "tail",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Print the last part of files, optionally following them live — POSIX tail or PowerShell's Get-Content -Tail/-Wait.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "powershell"],
};
