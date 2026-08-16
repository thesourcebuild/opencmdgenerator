import type { CommandManifest } from "@cmdgen/engine";

export const LSCPU_MANIFEST: CommandManifest = {
  id: "lscpu",
  label: "lscpu",
  category: "System",
  tags: ["System"],
  summary: "Display CPU architecture information.",
  platforms: ["linux"],
  shells: ["posix"],
};
