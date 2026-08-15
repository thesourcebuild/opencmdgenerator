import type { CommSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: CommSpec): string {
  const file1 = spec.file1.trim() || "FILE1";
  const file2 = spec.file2.trim() || "FILE2";

  const col1 = !flagBool(spec, "suppressCol1");
  const col2 = !flagBool(spec, "suppressCol2");
  const col3 = !flagBool(spec, "suppressCol3");

  const kept: string[] = [];
  if (col1) kept.push(`lines only in ${file1}`);
  if (col2) kept.push(`lines only in ${file2}`);
  if (col3) kept.push("lines common to both");

  const parts: string[] = [
    kept.length === 0
      ? `Compare ${file1} and ${file2} (both must already be sorted), printing nothing — every column is suppressed`
      : `Compare ${file1} and ${file2} (both must already be sorted), printing ${kept.join(", ")}`,
  ];

  if (flagBool(spec, "ignoreCase")) parts.push("comparing case-insensitively");

  return `${parts.join(", ")}.`;
}
