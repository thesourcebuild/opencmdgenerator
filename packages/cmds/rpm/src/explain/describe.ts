import type { RpmSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: RpmSpec): string {
  const target = spec.target.trim();

  let lead: string;
  if (spec.operation === "queryAll") {
    lead = "List every installed package";
  } else if (spec.operation === "install") {
    const file = target !== "" ? target : "SOME_FILE.rpm";
    lead = `Install ${file}`;
  } else if (spec.operation === "erase") {
    const name = target !== "" ? target : "SOME_PACKAGE";
    lead = `Remove ${name}`;
  } else {
    const name = target !== "" ? target : "SOME_PACKAGE";
    lead = `Show details for ${name}`;
  }

  const parts: string[] = [lead];

  if (flagBool(spec, "verbose")) parts.push("printing verbose output");
  if (flagBool(spec, "hash")) parts.push("showing hash marks as a progress indicator");
  if (flagBool(spec, "force")) parts.push("forcing the install even over a newer package or conflicting files");
  if (flagBool(spec, "noDeps")) parts.push("skipping dependency checks");

  return `${parts.join(", ")}.`;
}
