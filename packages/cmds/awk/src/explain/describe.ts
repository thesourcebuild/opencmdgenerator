import type { AwkSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: AwkSpec): string {
  const program = spec.program.trim() || "PROGRAM";
  const files = spec.files.filter((f) => f.trim() !== "");
  const where = files.length > 0 ? files.join(", ") : "standard input";

  const parts: string[] = [`Run the awk program ${program} over ${where}`];

  const fs = flagString(spec, "fieldSeparator");
  if (fs) parts.push(`splitting fields on "${fs}"`);

  const assignments = spec.assignments.filter((a) => a.trim() !== "");
  if (assignments.length > 0) parts.push(`with ${assignments.join(", ")} assigned via -v`);

  if (flagBool(spec, "posixMode")) parts.push("in POSIX-compatible mode");

  return `${parts.join(", ")}. Note: this only models a core subset of awk's own flags — the program text itself is passed through verbatim and could, in principle, write files on its own; this generator has no way to detect that.`;
}
