import type { HeadSpec } from "../spec";
import { flagBool, flagNumber } from "../pure";

export function describeSpec(spec: HeadSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILE";

  const lines = flagNumber(spec, "linesCount");
  const bytes = flagNumber(spec, "bytesCount");
  const totalCount = flagNumber(spec, "totalCountPs");

  const amount =
    bytes !== undefined ? `the first ${bytes} bytes` : `the first ${lines ?? totalCount ?? 10} lines`;

  const parts: string[] = [`Print ${amount} of ${target}`];

  if (flagBool(spec, "quiet")) parts.push("without a header naming the file");
  else if (flagBool(spec, "verbose")) parts.push("with a header naming the file");

  return `${parts.join(", ")}.`;
}
