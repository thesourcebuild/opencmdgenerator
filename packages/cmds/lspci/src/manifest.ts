import type { CommandManifest } from "@cmdgen/engine";

export const LSPCI_MANIFEST: CommandManifest = {
  id: "lspci",
  label: "lspci",
  category: "System",
  tags: ["System"],
  summary: "List PCI devices.",
  platforms: ["linux"],
  shells: ["posix"],
};
