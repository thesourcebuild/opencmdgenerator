import type { CommandManifest } from "@cmdgen/engine";

export const DNF_MANIFEST: CommandManifest = {
  id: "dnf",
  label: "dnf",
  category: "Package",
  tags: ["Package"],
  summary: "DNF package manager.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
