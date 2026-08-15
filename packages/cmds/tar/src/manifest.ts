import type { CommandManifest } from "@cmdgen/engine";

export const TAR_MANIFEST: CommandManifest = {
  id: "tar",
  label: "tar",
  category: "Archive",
  tags: ["Archive", "Compression", "Backup", "Filesystem"],
  summary: "Bundle files into an archive, or unpack one — GNU tar or bsdtar (macOS and Windows).",
  platforms: ["darwin", "linux", "win32"],
  // bsdtar has shipped as System32\tar.exe since Windows 10 1803 — runs the same from cmd.exe.
  shells: ["posix", "cmd", "powershell"],
};
