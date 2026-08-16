import type { CommandManifest } from "@cmdgen/engine";

export const DMESG_MANIFEST: CommandManifest = {
  id: "dmesg",
  label: "dmesg",
  category: "System",
  tags: ["System"],
  summary: "Print or control the kernel ring buffer.",
  platforms: ["linux"],
  shells: ["posix"],
};
