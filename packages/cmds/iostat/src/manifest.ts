import type { CommandManifest } from "@cmdgen/engine";

export const IOSTAT_MANIFEST: CommandManifest = {
  id: "iostat",
  label: "iostat",
  category: "System",
  tags: ["System"],
  summary: "Display CPU and disk I/O statistics.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
