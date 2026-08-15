import type { CommandManifest } from "@cmdgen/engine";

export const POWEROFF_MANIFEST: CommandManifest = {
  id: "poweroff",
  label: "poweroff",
  category: "System",
  tags: ["System"],
  summary: "Halt the system and cut power to it.",
  // No win32/darwin — same reasoning as @cmdgen/halt: poweroff has no
  // Windows or macOS form by this name at all, and it can never be typed
  // into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["linux"],
  shells: ["posix"],
};
