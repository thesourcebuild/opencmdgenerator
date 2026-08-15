import type { CommandManifest } from "@cmdgen/engine";

export const UNAME_MANIFEST: CommandManifest = {
  id: "uname",
  label: "uname",
  category: "Shell",
  tags: ["Shell", "Environment"],
  summary: "Print system information — kernel name, hostname, release, architecture, and more.",
  // No win32 — Windows has no uname at all, native or otherwise. systeminfo,
  // ver, and PowerShell's $PSVersionTable/Get-ComputerInfo cover similar
  // ground with entirely different output shapes, not the same command.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
