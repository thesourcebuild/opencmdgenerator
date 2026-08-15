import type { CommandManifest } from "@cmdgen/engine";

export const KILLALL_MANIFEST: CommandManifest = {
  id: "killall",
  label: "killall",
  category: "Shell",
  tags: ["Shell", "Process"],
  summary: "Kill processes by name instead of by process ID.",
  // No win32 — same reasoning as @cmdgen/touch: killall has no cmd.exe or
  // PowerShell single-command form by this name at all (`taskkill /IM` is a
  // different tool with a different name, not modeled here), and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
