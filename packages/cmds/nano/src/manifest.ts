import type { CommandManifest } from "@cmdgen/engine";

export const NANO_MANIFEST: CommandManifest = {
  id: "nano",
  label: "nano",
  category: "Shell",
  tags: ["Shell", "Text", "Editor"],
  summary: "Open file(s) in the nano editor — a simple, beginner-friendly terminal text editor.",
  platforms: ["linux"],
  shells: ["posix"],
};
