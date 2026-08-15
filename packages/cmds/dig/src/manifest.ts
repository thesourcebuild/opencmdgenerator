import type { CommandManifest } from "@cmdgen/engine";

export const DIG_MANIFEST: CommandManifest = {
  id: "dig",
  label: "dig",
  category: "Network",
  tags: ["Network"],
  summary: "Query DNS records for a domain — A, MX, TXT, and more.",
  platforms: ["linux"],
  shells: ["posix"],
};
