import type { CommandManifest } from "@cmdgen/engine";

export const SORT_MANIFEST: CommandManifest = {
  id: "sort",
  label: "sort",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Sort lines of text — POSIX sort or cmd.exe's sort.",
  platforms: ["darwin", "linux", "win32"],
  // No "powershell" — Sort-Object needs Get-Content piped into it, a
  // different two-command shape this app doesn't model. See spec.ts.
  shells: ["posix", "cmd"],
};
