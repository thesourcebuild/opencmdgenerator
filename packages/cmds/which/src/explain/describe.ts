import type { WhichSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: WhichSpec): string {
  const names = spec.names.map((n) => n.trim()).filter((n) => n !== "");
  const target = names.length === 0 ? "SOME_COMMAND" : names.length === 1 ? names[0]! : `${names.length} commands`;

  const parts: string[] = [`Locate ${target} in PATH`];

  if (flagBool(spec, "silent")) {
    parts.push("printing nothing and only setting the exit status");
  } else if (flagBool(spec, "all")) {
    parts.push("reporting every matching executable, not just the first");
  }

  return `${parts.join(", ")}.`;
}
