import type { CommandManifest } from "@cmdgen/engine";

export const LESS_MANIFEST: CommandManifest = {
  id: "less",
  label: "less",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Page through a file's contents, with search and backward scrolling.",
  // No win32 — less has no native Windows install at all. cmd.exe/PowerShell's
  // `more` is too limited (no search, no backward scrolling) to count as the
  // same command on another platform the way Get-Content is for head/tail.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
