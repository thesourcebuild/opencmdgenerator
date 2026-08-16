import type { CommandManifest } from "@cmdgen/engine";

export const PRINTF_MANIFEST: CommandManifest = {
  id: "printf",
  label: "printf",
  category: "Shell",
  tags: ["Shell"],
  summary: "Format and print data.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
