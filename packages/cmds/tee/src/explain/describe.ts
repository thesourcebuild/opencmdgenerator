import type { TeeSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: TeeSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const targets = files.length > 0 ? files.join(", ") : "no files (only standard output)";

  const append = flagBool(spec, "append");
  const verb = append ? "appending to" : "overwriting";

  const parts: string[] = [`Copy standard input to standard output, ${verb} ${targets}`];

  if (flagBool(spec, "ignoreInterrupts")) parts.push("ignoring interrupt signals");

  return `${parts.join(", ")}.`;
}
