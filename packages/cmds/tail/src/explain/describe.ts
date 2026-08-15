import type { TailSpec } from "../spec";
import { flagBool, flagNumber } from "../pure";

export function describeSpec(spec: TailSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILE";

  const lines = flagNumber(spec, "linesCount");
  const bytes = flagNumber(spec, "bytesCount");
  const tailCount = flagNumber(spec, "tailCountPs");

  const amount =
    bytes !== undefined ? `the last ${bytes} bytes` : `the last ${lines ?? tailCount ?? 10} lines`;

  const parts: string[] = [`Print ${amount} of ${target}`];

  if (flagBool(spec, "follow") || flagBool(spec, "waitPs")) parts.push("then keep watching for new lines as they're appended");
  if (flagBool(spec, "quiet")) parts.push("without a header naming the file");
  else if (flagBool(spec, "verbose")) parts.push("with a header naming the file");

  return `${parts.join(", ")}.`;
}
