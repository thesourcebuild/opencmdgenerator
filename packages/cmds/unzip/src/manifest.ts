import type { CommandManifest } from "@cmdgen/engine";

export const UNZIP_MANIFEST: CommandManifest = {
  id: "unzip",
  label: "unzip",
  category: "Archive",
  tags: ["Archive"],
  summary: "Extract files from a .zip archive.",
  // No win32 — unzip has no Windows-native or PowerShell form by the same
  // name (PowerShell's `Expand-Archive` is a different tool, not modeled
  // here), and it can never be typed into a bare cmd.exe/PowerShell prompt
  // regardless. Same reasoning as @cmdgen/df and @cmdgen/mount.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
