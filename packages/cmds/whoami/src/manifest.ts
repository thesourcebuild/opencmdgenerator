import type { CommandManifest } from "@cmdgen/engine";

export const WHOAMI_MANIFEST: CommandManifest = {
  id: "whoami",
  label: "whoami",
  category: "Shell",
  tags: ["Shell", "Environment"],
  summary: "Print the current user's name — the same whoami binary on every platform, with extra flags on Windows.",
  platforms: ["darwin", "linux", "win32"],
  shells: ["posix", "cmd", "powershell"],
};
