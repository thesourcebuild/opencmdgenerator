import type { CommandManifest } from "@cmdgen/engine";

export const SERVICE_MANIFEST: CommandManifest = {
  id: "service",
  label: "service",
  category: "System",
  tags: ["System"],
  summary: "Start, stop, or check the status of a system service (SysV-init style).",
  // Linux only. `service` is the SysV-init-era wrapper still present on most
  // distros alongside systemd; macOS uses `launchctl`, a completely
  // different tool, not modeled here; and there is no Windows equivalent
  // either — `sc.exe`/`Get-Service` are different tools entirely.
  platforms: ["linux"],
  shells: ["posix"],
};
