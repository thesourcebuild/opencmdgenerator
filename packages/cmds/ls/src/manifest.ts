import type { CommandManifest } from "@cmdgen/engine";

export const LS_MANIFEST: CommandManifest = {
  id: "ls",
  label: "ls",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Listing"],
  summary: "List directory contents with filtering and sorting options — POSIX ls or PowerShell's Get-ChildItem.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "powershell"],
};
