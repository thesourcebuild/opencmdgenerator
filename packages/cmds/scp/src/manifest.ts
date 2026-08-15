import type { CommandManifest } from "@cmdgen/engine";

export const SCP_MANIFEST: CommandManifest = {
  id: "scp",
  label: "scp",
  category: "File Transfer",
  tags: ["File Transfer", "SSH", "Remote Copy"],
  summary:
    "Copy files to or from a remote host over SSH. 'scp' supports local→local, local→remote, remote→local, and remote→remote transfers.",
  platforms: ["darwin", "linux", "win32"],
  // scp.exe ships in the same Win32-OpenSSH package as ssh.exe — same cmd.exe availability.
  shells: ["posix", "cmd", "powershell"],
};
