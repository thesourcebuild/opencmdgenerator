import type { CommandManifest } from "@cmdgen/engine";

export const NMCLI_MANIFEST: CommandManifest = {
  id: "nmcli",
  label: "nmcli",
  category: "Network",
  tags: ["Network"],
  summary: "Control NetworkManager from the command line.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
