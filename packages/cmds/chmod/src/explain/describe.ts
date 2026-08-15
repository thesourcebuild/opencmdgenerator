import type { ChmodSpec } from "../spec";
import { flagBool, flagEnum, flagString } from "../pure";

export function describeSpec(spec: ChmodSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILE";

  const reference = flagString(spec, "reference");
  const mode = spec.mode.trim();

  const parts: string[] = [
    reference ? `Copy the permissions from ${reference} onto ${target}` : `Change the permissions of ${target} to ${mode || "MODE"}`,
  ];

  if (flagBool(spec, "recursive")) parts.push("recursively");
  const traversal = flagEnum(spec, "traversalMode", ["H", "L", "P"]);
  if (traversal) parts.push(`traversing symlinks per -${traversal}`);
  if (flagBool(spec, "dereference")) parts.push("following symlinks given directly on the command line");
  if (flagBool(spec, "noDereference")) parts.push("acting on symlinks themselves, not their targets");
  if (flagBool(spec, "preserveRoot")) parts.push("refusing to touch / recursively");
  if (flagBool(spec, "verbose")) parts.push("reporting on every file processed");
  else if (flagBool(spec, "changes")) parts.push("reporting only files that actually changed");

  return `${parts.join(", ")}.`;
}
