import type { SortSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: SortSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILE";

  const parts: string[] = [];

  if (flagBool(spec, "randomSort")) parts.push(`Shuffle the lines of ${target} into random order`);
  else if (flagBool(spec, "check")) parts.push(`Check whether ${target} is already sorted`);
  else {
    const by = flagBool(spec, "numeric") || flagBool(spec, "humanNumeric") ? "numerically" : "lexically";
    parts.push(`Sort the lines of ${target} ${by}`);
    if (flagBool(spec, "reverse") || flagBool(spec, "reverseCmd")) parts.push("in reverse order");
    if (flagBool(spec, "unique")) parts.push("keeping only the first of each set of equal lines");
    if (flagBool(spec, "ignoreCase")) parts.push("folding case");
  }

  return `${parts.join(", ")}.`;
}
