import type { CommandManifest } from "@cmdgen/engine";

export const JOBS_MANIFEST: CommandManifest = {
  id: "jobs",
  label: "jobs",
  category: "Process",
  tags: ["Process"],
  summary: "List active shell jobs.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
