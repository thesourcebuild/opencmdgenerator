import type { CommandManifest } from "@cmdgen/engine";

export const SU_MANIFEST: CommandManifest = {
  id: "su",
  label: "su",
  category: "System",
  tags: ["System"],
  summary: "Switch to another user, defaulting to root.",
  // su is a GNU/Linux-specific tool — no Windows equivalent, and while macOS
  // ships a BSD su with mostly-compatible core syntax, it isn't modeled here.
  platforms: ["linux"],
  shells: ["posix"],
};
