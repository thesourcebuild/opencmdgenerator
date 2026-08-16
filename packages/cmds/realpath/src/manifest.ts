import type { CommandManifest } from "@cmdgen/engine";

export const REALPATH_MANIFEST: CommandManifest = {
  id: "realpath",
  label: "realpath",
  category: "File",
  tags: ["File"],
  summary: "Print resolved absolute file paths.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
