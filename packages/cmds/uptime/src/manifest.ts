import type { CommandManifest } from "@cmdgen/engine";

export const UPTIME_MANIFEST: CommandManifest = {
  id: "uptime",
  label: "uptime",
  category: "Shell",
  tags: ["Shell", "System"],
  summary: "Show how long the system has been running, logged-in users, and load averages.",
  // No win32 — same reasoning as @cmdgen/top and @cmdgen/df: uptime has no
  // cmd.exe or PowerShell single-command form by the same name, and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
