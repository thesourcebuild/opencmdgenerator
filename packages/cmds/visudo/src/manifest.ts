import type { CommandManifest } from "@cmdgen/engine";

export const VISUDO_MANIFEST: CommandManifest = {
  id: "visudo",
  label: "visudo",
  category: "Security",
  tags: ["Security"],
  summary: "Safely edit the sudoers file.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
