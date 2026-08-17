import type { CommandManifest } from "@cmdgen/engine";

export const HOST_MANIFEST: CommandManifest = {
  id: "host",
  label: "host",
  category: "Network",
  tags: ["Network"],
  summary: "Perform DNS lookups.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
