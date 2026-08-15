import type { CommandManifest } from "@cmdgen/engine";

export const APT_MANIFEST: CommandManifest = {
  id: "apt",
  label: "apt",
  category: "System",
  tags: ["System", "Package Manager"],
  summary: "Install, remove, and search for packages on Debian and Ubuntu.",
  // apt is a Debian/Ubuntu-family tool; no macOS or Windows equivalent by
  // this name — unlike every other POSIX-only package so far (which still
  // covered darwin+linux), this is a genuinely single-platform command.
  platforms: ["linux"],
  shells: ["posix"],
};
