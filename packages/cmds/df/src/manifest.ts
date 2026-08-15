import type { CommandManifest } from "@cmdgen/engine";

export const DF_MANIFEST: CommandManifest = {
  id: "df",
  label: "df",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  summary: "Report disk space usage for mounted filesystems.",
  // No win32 — same reasoning as @cmdgen/touch and @cmdgen/uname: df has no
  // cmd.exe or PowerShell single-command form by the same name (wmic /
  // Get-PSDrive are different tools, not modeled here), and it can never be
  // typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
