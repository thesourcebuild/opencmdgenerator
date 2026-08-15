import type { CommandManifest } from "@cmdgen/engine";

export const ROUTE_MANIFEST: CommandManifest = {
  id: "route",
  label: "route",
  category: "Network",
  tags: ["Network"],
  summary: "Show or modify the kernel's IP routing table.",
  platforms: ["linux"],
  shells: ["posix"],
};
