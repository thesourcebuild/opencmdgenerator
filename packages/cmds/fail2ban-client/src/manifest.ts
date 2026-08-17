import type { CommandManifest } from "@cmdgen/engine";

export const FAIL2BAN_CLIENT_MANIFEST: CommandManifest = {
  id: "fail2ban-client",
  label: "fail2ban-client",
  category: "Security",
  tags: ["Security"],
  summary: "Control Fail2ban server and jails.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
