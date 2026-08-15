import type { CommandManifest } from "@cmdgen/engine";

export const GROUPMOD_MANIFEST: CommandManifest = {
  id: "groupmod",
  label: "groupmod",
  category: "System",
  tags: ["System"],
  summary: "Modify an existing group's GID or name.",
  // groupmod is a GNU/Linux-specific tool — no Windows equivalent, and macOS
  // uses dscl/dseditgroup instead, a different tool not modeled here.
  platforms: ["linux"],
  shells: ["posix"],
};
