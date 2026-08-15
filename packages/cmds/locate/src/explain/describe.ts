import type { LocateSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: LocateSpec): string {
  const pattern = spec.pattern.trim() || "PATTERN";
  const regexp = flagBool(spec, "regexp");

  const parts: string[] = [
    regexp
      ? `Search the locate database for names matching the regular expression ${pattern}`
      : `Search the locate database for names matching ${pattern}`,
  ];

  if (flagBool(spec, "ignoreCase")) parts.push("ignoring case");
  if (flagBool(spec, "count")) parts.push("printing only a count of matches");
  if (flagBool(spec, "all")) parts.push("requiring every given pattern to match");

  return `${parts.join(", ")}.`;
}
