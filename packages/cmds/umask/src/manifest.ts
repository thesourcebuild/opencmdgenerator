import type { CommandManifest } from "@cmdgen/engine";

export const UMASK_MANIFEST: CommandManifest = {
  id: "umask",
  label: "umask",
  category: "Shell",
  tags: ["Shell"],
  summary: "Show or set default file creation permissions.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
