import type { CommandManifest } from "@cmdgen/engine";

export const PS_MANIFEST: CommandManifest = {
  id: "ps",
  label: "ps",
  category: "Shell",
  tags: ["Shell", "Process"],
  summary: "List running processes — by user, by all, or in full detail.",
  // No win32 — ps has no Windows-native or PowerShell form by the same name.
  // Get-Process covers similar ground but with an entirely different command
  // name and output shape, not the same command elsewhere; only ever reached
  // from within a POSIX-capable shell.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
