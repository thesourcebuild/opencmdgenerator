import type { CommandManifest } from "@cmdgen/engine";

export const CHATTR_MANIFEST: CommandManifest = {
  id: "chattr",
  label: "chattr",
  category: "Security",
  tags: ["Security"],
  summary: "Change Linux file attributes.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
