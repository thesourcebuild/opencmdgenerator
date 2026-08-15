import type { ViSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: ViSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "an unnamed buffer";

  const parts: string[] = [`Open ${target} in vi`];

  if (flagBool(spec, "readonly")) parts.push("in read-only mode");
  if (spec.startLine !== undefined && spec.startLine > 0) parts.push(`starting at line ${spec.startLine}`);

  return `${parts.join(", ")}.`;
}
