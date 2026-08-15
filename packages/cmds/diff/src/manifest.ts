import type { CommandManifest } from "@cmdgen/engine";

export const DIFF_MANIFEST: CommandManifest = {
  id: "diff",
  label: "diff",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Compare files line by line — POSIX diff or cmd.exe's fc.",
  platforms: ["darwin", "linux", "win32"],
  // No "powershell" — Compare-Object needs Get-Content piped into it twice,
  // a different two-command shape this app doesn't model. See spec.ts.
  shells: ["posix", "cmd"],
};
