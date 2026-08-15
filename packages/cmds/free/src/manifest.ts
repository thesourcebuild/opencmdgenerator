import type { CommandManifest } from "@cmdgen/engine";

export const FREE_MANIFEST: CommandManifest = {
  id: "free",
  label: "free",
  category: "Shell",
  tags: ["Shell", "System"],
  summary: "Report total, used, and available memory and swap.",
  // No win32 — same reasoning as @cmdgen/top and @cmdgen/df: free has no
  // cmd.exe or PowerShell single-command form by the same name, and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
