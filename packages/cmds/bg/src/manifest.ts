import type { CommandManifest } from "@cmdgen/engine";

export const BG_MANIFEST: CommandManifest = {
  id: "bg",
  label: "bg",
  category: "Process",
  tags: ["Process"],
  summary: "Resume jobs in the background.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
