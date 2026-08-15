import type { CommandManifest } from "@cmdgen/engine";

export const SSH_MANIFEST: CommandManifest = {
  id: "ssh",
  label: "ssh",
  category: "Network",
  tags: ["Network", "SSH", "Remote Access"],
  summary: "Connect to a remote machine securely over SSH.",
  platforms: ["darwin", "linux", "win32"],
  // Win32-OpenSSH ships ssh.exe in System32 on Windows 10 1809+/11 — a plain
  // argv .exe, so it runs the same from cmd.exe as from PowerShell.
  shells: ["posix", "cmd", "powershell"],
};
