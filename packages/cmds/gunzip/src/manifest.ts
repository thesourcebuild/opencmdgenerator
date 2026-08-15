import type { CommandManifest } from "@cmdgen/engine";

export const GUNZIP_MANIFEST: CommandManifest = {
  id: "gunzip",
  label: "gunzip",
  category: "Archive",
  tags: ["Archive"],
  summary: "Decompress .gz files, replacing each one with the original by default.",
  // No win32 — same reasoning as @cmdgen/gzip and @cmdgen/df: gunzip has no
  // cmd.exe or PowerShell single-command form by the same name, and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
