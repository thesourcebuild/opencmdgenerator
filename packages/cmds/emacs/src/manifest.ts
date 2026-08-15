import type { CommandManifest } from "@cmdgen/engine";

export const EMACS_MANIFEST: CommandManifest = {
  id: "emacs",
  label: "emacs",
  category: "Shell",
  tags: ["Shell", "Text", "Editor"],
  summary: "Open file(s) in the Emacs editor — graphical window, terminal mode, or a background server.",
  platforms: ["linux"],
  shells: ["posix"],
};
