import type { CmpSpec } from "../spec";
import { flagBool, flagNumber } from "../pure";

export function describeSpec(spec: CmpSpec): string {
  const file1 = spec.file1.trim() || "FILE1";
  const file2 = spec.file2.trim() || "FILE2";

  const parts: string[] = [];

  if (flagBool(spec, "silent")) {
    parts.push(`Check whether ${file1} and ${file2} are byte-for-byte identical, printing nothing`);
  } else if (flagBool(spec, "verbose")) {
    parts.push(`Compare ${file1} and ${file2} byte-for-byte, listing every differing byte`);
  } else {
    parts.push(`Compare ${file1} and ${file2} byte-for-byte, stopping at the first difference`);
  }

  const skip = flagNumber(spec, "ignoreInitial");
  if (skip !== undefined) parts.push(`skipping the first ${skip} bytes of each`);
  const limit = flagNumber(spec, "bytesLimit");
  if (limit !== undefined) parts.push(`comparing at most ${limit} bytes`);

  return `${parts.join(", ")}.`;
}
