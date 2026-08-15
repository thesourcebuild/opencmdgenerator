import type { CommandManifest } from "@cmdgen/engine";

export const CHMOD_MANIFEST: CommandManifest = {
  id: "chmod",
  label: "chmod",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Permissions"],
  summary: "Change file access permissions (read/write/execute) for owner, group, and others.",
  // No win32 — unlike rsync/ssh/scp/tar (installed once, then invocable from any
  // shell), chmod can never be typed into a bare cmd.exe/PowerShell prompt at
  // all, even with WSL/Git Bash/Cygwin installed — you have to already be
  // inside that POSIX shell before "chmod" is a real command, which doesn't
  // meet the bar of "runs on this OS" the way rsync's win32 claim does.
  platforms: ["darwin", "linux"],
  // Only ever reached from within a POSIX-capable shell — no cmd.exe or PowerShell form exists at all.
  shells: ["posix"],
};
