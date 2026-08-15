import type { NanoSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: NanoSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "an empty, unnamed buffer";

  const parts: string[] = [`Open ${target} in nano`];

  if (flagBool(spec, "lineNumbers")) parts.push("showing line numbers");
  if (flagBool(spec, "noWrap")) parts.push("without wrapping long lines");
  if (flagBool(spec, "backup")) parts.push("backing up the original before saving");
  if (flagBool(spec, "mouse")) parts.push("with mouse support enabled");

  return `${parts.join(", ")}.`;
}
