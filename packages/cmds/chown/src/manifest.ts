import type { CommandManifest } from "@cmdgen/engine";

export const CHOWN_MANIFEST: CommandManifest = {
  id: "chown",
  label: "chown",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Permissions"],
  summary: "Change file owner and group.",
  // No win32 — same reasoning as @cmdgen/chmod, plus Windows has no
  // owner:group ownership model to change in the first place (ACLs are a
  // completely different permission system).
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
