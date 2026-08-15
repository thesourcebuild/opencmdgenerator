import type { CommandManifest } from "@cmdgen/engine";

export const CAL_MANIFEST: CommandManifest = {
  id: "cal",
  label: "cal",
  category: "Shell",
  tags: ["Shell", "Utilities"],
  summary: "Display a calendar for a month or year.",
  // No win32 — Windows has no CLI command by the name "cal".
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
