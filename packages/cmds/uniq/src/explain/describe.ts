import type { UniqSpec } from "../spec";
import { flagBool, flagNumber } from "../pure";

export function describeSpec(spec: UniqSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const input = files[0] ?? "standard input";
  const output = files[1];

  let verb = "Filter";
  if (flagBool(spec, "repeated")) verb = "Print only the repeated";
  else if (flagBool(spec, "unique")) verb = "Print only the non-repeated";

  const parts: string[] = [`${verb} adjacent duplicate lines in ${input}`];

  if (output) parts.push(`writing the result to ${output}`);
  if (flagBool(spec, "count")) parts.push("prefixing each line with its occurrence count");
  if (flagBool(spec, "ignoreCase")) parts.push("folding case when comparing");
  const skip = flagNumber(spec, "skipFields");
  if (skip !== undefined) parts.push(`ignoring the first ${skip} field(s) when comparing`);

  return `${parts.join(", ")}.`;
}
