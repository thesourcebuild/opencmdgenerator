import type { CommandManifest } from "@cmdgen/engine";

export const USERMOD_MANIFEST: CommandManifest = {
  id: "usermod",
  label: "usermod",
  category: "System",
  tags: ["System"],
  summary: "Modify an existing user account.",
  // usermod is a GNU/Linux-specific tool — macOS uses dscl/sysadminctl, a
  // completely different tool and syntax, not modeled here; no Windows
  // equivalent either.
  platforms: ["linux"],
  shells: ["posix"],
};
