import type { CommandManifest } from "@cmdgen/engine";

export const SS_MANIFEST: CommandManifest = {
  id: "ss",
  label: "ss",
  category: "Network",
  tags: ["Network"],
  summary: "Inspect sockets and network connections.",
  platforms: ["linux"],
  shells: ["posix"],
};
