import type { CommandManifest } from "@cmdgen/engine";

export const GROUPADD_MANIFEST: CommandManifest = {
  id: "groupadd",
  label: "groupadd",
  category: "System",
  tags: ["System"],
  summary: "Create a new group.",
  // groupadd is a GNU/Linux-specific tool — no Windows equivalent, and macOS
  // uses dscl/dseditgroup instead, a different tool not modeled here.
  platforms: ["linux"],
  shells: ["posix"],
};
