import type { DuSpec } from "../spec";
import { flagBool, flagNumber } from "../pure";

export function describeSpec(spec: DuSpec): string {
  const paths = spec.paths.filter((p) => p.trim() !== "");
  const target = paths.length > 0 ? paths.join(", ") : "the current directory";

  const parts: string[] = [`Report disk usage for ${target}`];

  if (flagBool(spec, "humanReadable")) parts.push("using human-readable units");
  if (flagBool(spec, "summarize")) parts.push("showing only a total for each argument");
  if (flagBool(spec, "all")) parts.push("including individual files, not just directories");

  const maxDepth = flagNumber(spec, "maxDepth");
  if (maxDepth !== undefined) parts.push(`limited to ${maxDepth} director${maxDepth === 1 ? "y" : "ies"} deep`);

  if (flagBool(spec, "total")) parts.push("printing a grand total at the end");

  return `${parts.join(", ")}.`;
}
