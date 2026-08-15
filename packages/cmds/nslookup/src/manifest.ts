import type { CommandManifest } from "@cmdgen/engine";

export const NSLOOKUP_MANIFEST: CommandManifest = {
  id: "nslookup",
  label: "nslookup",
  category: "Network",
  tags: ["Network"],
  summary: "Query DNS interactively from the command line — look up a name's records or a server's PTR entry.",
  platforms: ["linux"],
  shells: ["posix"],
};
