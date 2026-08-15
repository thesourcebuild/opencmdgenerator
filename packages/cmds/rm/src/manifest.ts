import type { CommandManifest } from "@cmdgen/engine";

export const RM_MANIFEST: CommandManifest = {
  id: "rm",
  label: "rm",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Destructive"],
  summary: "Remove files and directories — POSIX rm or PowerShell's Remove-Item. Permanent — there is no trash or undo.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "powershell"],
};
