import type { CommandManifest } from "@cmdgen/engine";

export const SHUTDOWN_MANIFEST: CommandManifest = {
  id: "shutdown",
  label: "shutdown",
  category: "System",
  tags: ["System"],
  summary: "Schedule (or cancel) a system halt, power-off, or reboot, with an optional broadcast warning.",
  // No win32/darwin — same reasoning as @cmdgen/halt: this shutdown is the
  // Linux/systemd binary and has no Windows or macOS form by this name at
  // all (Windows' own `shutdown.exe` is a different tool with different
  // flags, not modeled here), and it can never be typed into a bare
  // cmd.exe/PowerShell prompt regardless.
  platforms: ["linux"],
  shells: ["posix"],
};
