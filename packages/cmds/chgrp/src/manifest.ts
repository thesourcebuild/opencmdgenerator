import type { CommandManifest } from "@cmdgen/engine";

export const CHGRP_MANIFEST: CommandManifest = {
  id: "chgrp",
  label: "chgrp",
  category: "Shell",
  tags: ["Shell", "Filesystem", "Permissions"],
  summary: "Change the group ownership of files.",
  // No win32 — same reasoning as @cmdgen/chown: Windows has no group-ownership model to change.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
