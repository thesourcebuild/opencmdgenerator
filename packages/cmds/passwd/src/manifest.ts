import type { CommandManifest } from "@cmdgen/engine";

export const PASSWD_MANIFEST: CommandManifest = {
  id: "passwd",
  label: "passwd",
  category: "System",
  tags: ["System"],
  summary: "Change a user's password, or lock/unlock an account.",
  // No win32 — same reasoning as @cmdgen/killall: passwd has no cmd.exe or
  // PowerShell single-command form by this name at all (`net user` is a
  // different tool with a different name, not modeled here), and it can
  // never be typed into a bare cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
