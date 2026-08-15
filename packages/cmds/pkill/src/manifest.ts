import type { CommandManifest } from "@cmdgen/engine";

export const PKILL_MANIFEST: CommandManifest = {
  id: "pkill",
  label: "pkill",
  category: "Shell",
  tags: ["Shell", "Process"],
  summary: "Signal processes matched by name pattern instead of by process ID.",
  // Linux only, per this app's scope for this command.
  platforms: ["linux"],
  shells: ["posix"],
};
