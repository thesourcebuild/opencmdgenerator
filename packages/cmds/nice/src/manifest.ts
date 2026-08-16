import type { CommandManifest } from "@cmdgen/engine";

export const NICE_MANIFEST: CommandManifest = {
  id: "nice",
  label: "nice",
  category: "Process",
  tags: ["Process"],
  summary: "Run a command with modified scheduling priority.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
