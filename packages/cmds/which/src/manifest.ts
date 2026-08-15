import type { CommandManifest } from "@cmdgen/engine";

export const WHICH_MANIFEST: CommandManifest = {
  id: "which",
  label: "which",
  category: "Shell",
  tags: ["Shell", "Documentation"],
  summary: "Locate the executable that would run for one or more command names.",
  // Linux only, per this app's scope for this command — which has no
  // cmd.exe or PowerShell single-command equivalent by this name either
  // (`Get-Command` is a different tool with different output), and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["linux"],
  shells: ["posix"],
};
