import type { CommandManifest } from "@cmdgen/engine";

export const LTRACE_MANIFEST: CommandManifest = {
  id: "ltrace",
  label: "ltrace",
  category: "Process",
  tags: ["Process"],
  summary: "Trace library calls.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
