import type { CommandManifest } from "@cmdgen/engine";

export const TEE_MANIFEST: CommandManifest = {
  id: "tee",
  label: "tee",
  category: "Shell",
  tags: ["Shell", "Text"],
  summary: "Copy standard input to standard output and to one or more files at once.",
  // No win32 — tee has no cmd.exe or PowerShell single-command form by the
  // same name (Tee-Object is a different cmdlet, not modeled here); only
  // ever reached from within a POSIX-capable shell.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
