import type { CommandManifest } from "@cmdgen/engine";

export const TOUCH_MANIFEST: CommandManifest = {
  id: "touch",
  label: "touch",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Create empty files or update their access/modification timestamps.",
  // No win32 — same reasoning as @cmdgen/chmod: touch has no cmd.exe or
  // PowerShell single-command form at all (New-Item plus separately setting
  // .LastWriteTime is a composite operation, not one command), and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
