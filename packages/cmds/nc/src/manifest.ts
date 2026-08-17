import type { CommandManifest } from "@cmdgen/engine";

export const NC_MANIFEST: CommandManifest = {
  id: "nc",
  label: "nc",
  category: "Network",
  tags: ["Network"],
  summary: "Read and write network connections.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
