import type { CommandManifest } from "@cmdgen/engine";

export const USERADD_MANIFEST: CommandManifest = {
  id: "useradd",
  label: "useradd",
  category: "System",
  tags: ["System"],
  summary: "Create a new user account.",
  // useradd is a GNU/Linux-specific tool — macOS uses dscl/sysadminctl, a
  // completely different tool and syntax, not modeled here; no Windows
  // equivalent either.
  platforms: ["linux"],
  shells: ["posix"],
};
