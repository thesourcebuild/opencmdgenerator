import type { CommandManifest } from "@cmdgen/engine";

export const IFCONFIG_MANIFEST: CommandManifest = {
  id: "ifconfig",
  label: "ifconfig",
  category: "Network",
  tags: ["Network"],
  summary: "Display or configure network interfaces — ifconfig on Linux/macOS, ipconfig on Windows.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "cmd", "powershell"],
};
