import type { CommandManifest } from "@cmdgen/engine";

export const RSYSLOGD_MANIFEST: CommandManifest = {
  id: "rsyslogd",
  label: "rsyslogd",
  category: "System",
  tags: ["System", "Logging", "Daemon"],
  summary: "The syslog daemon — normally started by the init system with no arguments; these flags cover manual/debug invocation (foreground, config file, config check, debug mode).",
  // rsyslogd is a Linux-only daemon (macOS uses Apple System Log instead,
  // and there is no Windows equivalent at all), same genuinely-single-platform
  // shape as @cmdgen/iptables.
  platforms: ["linux"],
  shells: ["posix"],
};
