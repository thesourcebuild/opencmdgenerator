import type { CommandManifest } from "@cmdgen/engine";

export const ADDUSER_MANIFEST: CommandManifest = {
  id: "adduser",
  label: "adduser",
  category: "System",
  tags: ["System"],
  summary: "Interactively create a new user or system account (Debian/Ubuntu).",
  // adduser is a Debian/Ubuntu-family wrapper around useradd — RPM-based
  // distributions (and every other OS) use useradd directly, a different
  // (already-modeled) flag surface, not this one.
  platforms: ["linux"],
  platformNotes: {
    linux: "Debian/Ubuntu-family specific — other distributions use useradd directly.",
  },
  shells: ["posix"],
};
