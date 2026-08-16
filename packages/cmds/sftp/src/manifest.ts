import type { CommandManifest } from "@cmdgen/engine";

export const SFTP_MANIFEST: CommandManifest = {
  id: "sftp",
  label: "sftp",
  category: "Network",
  tags: ["Network"],
  summary: "Secure file transfer client.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
