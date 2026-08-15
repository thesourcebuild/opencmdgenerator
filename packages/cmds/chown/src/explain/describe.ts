import type { ChownSpec } from "../spec";
import { flagBool, flagEnum, flagString } from "../pure";

export function describeSpec(spec: ChownSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILE";

  const reference = flagString(spec, "reference");
  const owner = spec.owner.trim();

  const parts: string[] = [
    reference ? `Copy the owner and group from ${reference} onto ${target}` : `Change the owner of ${target} to ${owner || "OWNER"}`,
  ];

  if (flagBool(spec, "recursive")) parts.push("recursively");
  const traversal = flagEnum(spec, "traversalMode", ["H", "L", "P"]);
  if (traversal) parts.push(`traversing symlinks per -${traversal}`);
  if (flagBool(spec, "dereference")) parts.push("following symlinks given directly on the command line");
  if (flagBool(spec, "noDereference")) parts.push("acting on symlinks themselves, not their targets");
  const from = flagString(spec, "from");
  if (from) parts.push(`only if it currently matches ${from}`);
  if (flagBool(spec, "preserveRoot")) parts.push("refusing to touch / recursively");
  if (flagBool(spec, "verbose")) parts.push("reporting on every file processed");
  else if (flagBool(spec, "changes")) parts.push("reporting only files that actually changed");

  return `${parts.join(", ")}.`;
}
