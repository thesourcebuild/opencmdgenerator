import type { CommandManifest } from "@cmdgen/engine";

export const FUSER_MANIFEST: CommandManifest = {
  id: "fuser",
  label: "fuser",
  category: "Process",
  tags: ["Process"],
  summary: "Identify processes using files or sockets.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
