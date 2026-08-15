import type { CommandManifest } from "@cmdgen/engine";

export const EXPORT_MANIFEST: CommandManifest = {
  id: "export",
  label: "export",
  category: "Shell",
  tags: ["Shell", "Environment"],
  summary: "Set an environment variable — bash/zsh builtin, cmd.exe's set, or PowerShell's $env:.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "cmd", "powershell"],
};
