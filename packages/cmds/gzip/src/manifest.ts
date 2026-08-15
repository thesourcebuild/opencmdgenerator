import type { CommandManifest } from "@cmdgen/engine";

export const GZIP_MANIFEST: CommandManifest = {
  id: "gzip",
  label: "gzip",
  category: "Archive",
  tags: ["Archive"],
  summary: "Compress files with gzip, replacing each one with a .gz by default.",
  // No win32 — same reasoning as @cmdgen/zip and @cmdgen/df: gzip has no
  // cmd.exe or PowerShell single-command form by the same name, and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
