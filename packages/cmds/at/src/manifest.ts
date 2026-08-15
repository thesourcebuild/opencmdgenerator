import type { CommandManifest } from "@cmdgen/engine";

export const AT_MANIFEST: CommandManifest = {
  id: "at",
  label: "at",
  category: "System",
  tags: ["System"],
  summary: "Schedule a one-off command to run at a specific time, list scheduled jobs (atq), or cancel one (atrm).",
  // Linux only — at has no macOS or Windows equivalent by this name
  // (Windows' closest counterpart is Task Scheduler, a fundamentally
  // different mechanism, not modeled here).
  platforms: ["linux"],
  shells: ["posix"],
};
