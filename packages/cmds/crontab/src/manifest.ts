import type { CommandManifest } from "@cmdgen/engine";

export const CRONTAB_MANIFEST: CommandManifest = {
  id: "crontab",
  label: "crontab",
  category: "System",
  tags: ["System", "Destructive"],
  summary: "List, edit, or remove a user's scheduled cron jobs.",
  // Linux only — crontab has no macOS or Windows equivalent by this name
  // (Windows' closest counterpart is Task Scheduler, a fundamentally
  // different mechanism, not modeled here).
  platforms: ["linux"],
  shells: ["posix"],
};
