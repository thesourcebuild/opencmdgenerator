import type { CommandManifest } from "@cmdgen/engine";

export const LSOF_MANIFEST: CommandManifest = {
  id: "lsof",
  label: "lsof",
  category: "Process",
  tags: ["Process"],
  summary: "List open files.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
