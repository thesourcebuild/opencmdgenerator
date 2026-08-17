import type { CommandManifest } from "@cmdgen/engine";

export const MTR_MANIFEST: CommandManifest = {
  id: "mtr",
  label: "mtr",
  category: "Network",
  tags: ["Network"],
  summary: "Trace network paths with continuous statistics.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
