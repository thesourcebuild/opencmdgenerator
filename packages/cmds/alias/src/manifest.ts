import type { CommandManifest } from "@cmdgen/engine";

export const ALIAS_MANIFEST: CommandManifest = {
  id: "alias",
  label: "alias",
  category: "Shell",
  tags: ["Shell", "Environment"],
  summary: "Create a shortcut for a command — bash/zsh builtin, or PowerShell's Set-Alias.",
  // No "cmd" — cmd.exe's doskey macros are real but process-local to the
  // current console (gone once that window closes), unlike a shell alias or
  // a PowerShell profile entry, so this app doesn't offer it as a target.
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "powershell"],
};
