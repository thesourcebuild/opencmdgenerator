import type { CommandManifest } from "@cmdgen/engine";

export const WHOIS_MANIFEST: CommandManifest = {
  id: "whois",
  label: "whois",
  category: "Network",
  tags: ["Network"],
  summary: "Look up a domain's or IP address's registration record.",
  platforms: ["linux"],
  shells: ["posix"],
};
