import type { CommandManifest } from "@cmdgen/engine";

export const FIREWALLD_MANIFEST: CommandManifest = {
  id: "firewalld",
  label: "firewalld",
  category: "Security",
  tags: ["Security"],
  summary: "Firewalld service entry point.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
