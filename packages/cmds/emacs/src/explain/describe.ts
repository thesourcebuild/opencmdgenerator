import type { EmacsSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: EmacsSpec): string {
  if (flagBool(spec, "daemon")) {
    return "Start an Emacs server in the background, to be connected to later with emacsclient.";
  }

  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "an empty scratch buffer";

  const parts: string[] = [`Open ${target} in Emacs`];

  if (flagBool(spec, "noWindowSystem")) parts.push("in the terminal instead of a graphical window");
  if (flagBool(spec, "quickStart")) parts.push("skipping the init file");

  return `${parts.join(", ")}.`;
}
