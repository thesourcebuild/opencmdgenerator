import type { CommandManifest } from "@cmdgen/engine";

export const CLEAR_MANIFEST: CommandManifest = {
  id: "clear",
  label: "clear",
  category: "Shell",
  tags: ["Shell"],
  summary: "Clear the terminal screen — POSIX clear, cmd.exe's cls, or PowerShell's Clear-Host.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "cmd", "powershell"],
};
