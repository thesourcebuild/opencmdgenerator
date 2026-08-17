import type { CommandManifest } from "@cmdgen/engine";

export const LSATTR_MANIFEST: CommandManifest = {
  id: "lsattr",
  label: "lsattr",
  category: "Security",
  tags: ["Security"],
  summary: "List Linux file attributes.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
