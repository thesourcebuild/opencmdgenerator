import type { CommandManifest } from "@cmdgen/engine";

export const HALT_MANIFEST: CommandManifest = {
  id: "halt",
  label: "halt",
  category: "System",
  tags: ["System"],
  summary: "Stop the system without powering it off (most modern hardware powers off anyway).",
  // No win32/darwin — same reasoning as @cmdgen/sudo: halt has no Windows or
  // macOS form by this name at all, and it can never be typed into a bare
  // cmd.exe/PowerShell prompt regardless.
  platforms: ["linux"],
  shells: ["posix"],
};
