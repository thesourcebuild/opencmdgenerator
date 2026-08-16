import type { CommandManifest } from "@cmdgen/engine";

export const FG_MANIFEST: CommandManifest = {
  id: "fg",
  label: "fg",
  category: "Process",
  tags: ["Process"],
  summary: "Bring a background job to the foreground.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
