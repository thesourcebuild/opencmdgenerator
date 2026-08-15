import type { CommandManifest } from "@cmdgen/engine";

export const TOP_MANIFEST: CommandManifest = {
  id: "top",
  label: "top",
  category: "Shell",
  tags: ["Shell", "Process"],
  summary: "Display and update sorted process information in real time.",
  // No win32 — Windows has no CLI command by the name "top". Task Manager
  // covers similar ground but is a GUI, not a single command this app can
  // model the same way.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
