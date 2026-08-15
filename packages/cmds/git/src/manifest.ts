import type { CommandManifest } from "@cmdgen/engine";

export const GIT_MANIFEST: CommandManifest = {
  id: "git",
  label: "git",
  category: "Version Control",
  tags: ["git", "vcs", "version-control", "clone", "commit", "push", "branch"],
  summary: "Clone, stage, commit, branch, merge, and sync a git repository.",
  platforms: ["linux", "darwin", "win32"],
  // git.exe is a real cross-platform binary — bundled with Git for Windows —
  // and works identically from cmd.exe and PowerShell, same justification as
  // curl/tar's shells list.
  shells: ["posix", "cmd", "powershell"],
};
