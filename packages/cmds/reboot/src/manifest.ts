import type { CommandManifest } from "@cmdgen/engine";

export const REBOOT_MANIFEST: CommandManifest = {
  id: "reboot",
  label: "reboot",
  category: "System",
  tags: ["System"],
  summary: "Restart the system.",
  // No win32/darwin — same reasoning as @cmdgen/halt: reboot has no
  // Windows or macOS form by this name at all, and it can never be typed
  // into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["linux"],
  shells: ["posix"],
};
