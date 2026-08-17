import type { CommandManifest } from "@cmdgen/engine";

export const DMIDECODE_MANIFEST: CommandManifest = {
  id: "dmidecode",
  label: "dmidecode",
  category: "System",
  tags: ["System"],
  summary: "Read hardware information from SMBIOS/DMI tables.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
