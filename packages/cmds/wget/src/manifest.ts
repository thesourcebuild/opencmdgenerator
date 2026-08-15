import type { CommandManifest } from "@cmdgen/engine";

export const WGET_MANIFEST: CommandManifest = {
  id: "wget",
  label: "wget",
  category: "Network",
  tags: ["Network"],
  summary: "Download files from the web via HTTP, HTTPS, or FTP.",
  // No win32 — same reasoning as @cmdgen/killall: wget has no cmd.exe or
  // PowerShell single-command form by this name at all (`Invoke-WebRequest`
  // is a different tool with entirely different syntax, not modeled here),
  // and it can never be typed into a bare cmd.exe/PowerShell prompt
  // regardless. On macOS, wget must be installed via a package manager
  // (e.g. Homebrew) — it is not bundled with the OS — same assumption this
  // app already makes for other tools like rsync.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
