import type { CommandManifest } from "@cmdgen/engine";

export const VMSTAT_MANIFEST: CommandManifest = {
  id: "vmstat",
  label: "vmstat",
  category: "Shell",
  tags: ["Shell", "System"],
  summary: "Report virtual memory, process, CPU, and disk statistics.",
  // No win32 — same reasoning as @cmdgen/top and @cmdgen/df: vmstat has no
  // cmd.exe or PowerShell single-command form by the same name, and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
