import type { CommandManifest } from "@cmdgen/engine";

export const HOSTNAMECTL_MANIFEST: CommandManifest = {
  id: "hostnamectl",
  label: "hostnamectl",
  category: "System",
  tags: ["System"],
  summary: "Query and change system hostname settings.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
