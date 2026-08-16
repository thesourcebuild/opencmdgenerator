import type { CommandManifest } from "@cmdgen/engine";

export const FTP_MANIFEST: CommandManifest = {
  id: "ftp",
  label: "ftp",
  category: "Network",
  tags: ["Network"],
  summary: "Interactive File Transfer Protocol client.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
