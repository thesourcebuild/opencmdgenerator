import type { WcSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: WcSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const where = files.length > 0 ? files.join(", ") : "standard input";

  const selected: string[] = [];
  if (flagBool(spec, "lines")) selected.push("lines");
  if (flagBool(spec, "words")) selected.push("words");
  if (flagBool(spec, "bytes")) selected.push("bytes");
  if (flagBool(spec, "chars")) selected.push("characters");

  const what = selected.length > 0 ? selected.join(", ") : "lines, words, and bytes";

  return `Count ${what} in ${where}.`;
}
