import type { CommandManifest } from "@cmdgen/engine";

export const KILL_MANIFEST: CommandManifest = {
  id: "kill",
  label: "kill",
  category: "Shell",
  tags: ["Shell", "Process", "Destructive"],
  summary: "Send a signal to a process (POSIX) or stop it (PowerShell's Stop-Process) — from a graceful request, to immediate and uncatchable.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "powershell"],
};
