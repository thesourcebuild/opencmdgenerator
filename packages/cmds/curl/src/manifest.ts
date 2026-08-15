import type { CommandManifest } from "@cmdgen/engine";

export const CURL_MANIFEST: CommandManifest = {
  id: "curl",
  label: "curl",
  category: "Networking",
  tags: ["Networking", "HTTP", "File Transfer", "API"],
  summary: "Transfer data to or from a URL — HTTP(S), FTP, SFTP/SCP, and more.",
  platforms: ["darwin", "linux", "win32"],
  // Windows 10 1803+ bundles the real curl.exe in System32 — same binary, same flags.
  shells: ["posix", "cmd", "powershell"],
};
