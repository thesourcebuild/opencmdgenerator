import type { CommandManifest } from "@cmdgen/engine";

export const ZIP_MANIFEST: CommandManifest = {
  id: "zip",
  label: "zip",
  category: "Archive",
  tags: ["Archive"],
  summary: "Package files into a compressed .zip archive.",
  // No win32 — same reasoning as @cmdgen/df and @cmdgen/touch: zip has no
  // cmd.exe or PowerShell single-command form by the same name (PowerShell's
  // Compress-Archive is a different tool with different syntax, not modeled
  // here), and it can never be typed into a bare cmd.exe/PowerShell prompt
  // regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
