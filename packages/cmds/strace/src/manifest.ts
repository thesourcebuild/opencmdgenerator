import type { CommandManifest } from "@cmdgen/engine";

export const STRACE_MANIFEST: CommandManifest = {
  id: "strace",
  label: "strace",
  category: "Process",
  tags: ["Process"],
  summary: "Trace system calls and signals.",
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
