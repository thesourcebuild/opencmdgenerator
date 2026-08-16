import type { CommandManifest } from "@cmdgen/engine";

export const IP_MANIFEST: CommandManifest = {
  id: "ip",
  label: "ip",
  category: "Network",
  tags: ["Network"],
  summary: "Show and manipulate Linux networking objects.",
  platforms: ["linux"],
  shells: ["posix"],
};
