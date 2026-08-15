import type { ChgrpSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: ChgrpSpec): string {
  const paths = spec.paths.filter((p) => p.trim() !== "");
  const target = paths.length > 0 ? paths.join(", ") : "SOME_FILE";

  const reference = flagString(spec, "reference");
  const group = spec.group.trim();

  const parts: string[] = [
    reference ? `Copy the group from ${reference} onto ${target}` : `Change the group of ${target} to ${group || "GROUP"}`,
  ];

  if (flagBool(spec, "recursive")) parts.push("recursively");
  if (flagBool(spec, "verbose")) parts.push("reporting on every file processed");

  return `${parts.join(", ")}.`;
}
