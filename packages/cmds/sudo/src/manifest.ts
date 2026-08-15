import type { CommandManifest } from "@cmdgen/engine";

export const SUDO_MANIFEST: CommandManifest = {
  id: "sudo",
  label: "sudo",
  category: "System",
  tags: ["System"],
  summary: "Run a command with elevated (root) privileges.",
  // No win32 — same reasoning as @cmdgen/killall: sudo has no cmd.exe or
  // PowerShell single-command form by this name at all (`runas`/UAC
  // elevation is a fundamentally different mechanism, not modeled here),
  // and it can never be typed into a bare cmd.exe/PowerShell prompt
  // regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
