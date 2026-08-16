import type { CommandManifest } from "@cmdgen/engine";

export const DATE_MANIFEST: CommandManifest = {
  id: "date",
  label: "date",
  category: "System",
  tags: ["System"],
  summary: "Print or set the system date and time.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
