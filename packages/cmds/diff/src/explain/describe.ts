import type { DiffSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: DiffSpec): string {
  const file1 = spec.file1.trim() || "FILE1";
  const file2 = spec.file2.trim() || "FILE2";

  const parts: string[] = [];

  if (flagBool(spec, "brief")) {
    parts.push(`Report only whether ${file1} and ${file2} differ`);
  } else {
    const format = flagBool(spec, "context") ? "context" : flagBool(spec, "unified") ? "unified" : "plain";
    parts.push(`Compare ${file1} and ${file2}, showing differences in ${format} format`);
  }

  if (flagBool(spec, "recursive")) parts.push("recursing into subdirectories");
  if (flagBool(spec, "ignoreCase") || flagBool(spec, "caseInsensitiveCmd")) parts.push("ignoring case");
  if (flagBool(spec, "ignoreAllSpace")) parts.push("ignoring all whitespace");
  if (flagBool(spec, "binaryCmd")) parts.push("byte-for-byte, not line-by-line");

  return `${parts.join(", ")}.`;
}
