import type { MoreSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: MoreSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILE";

  const parts: string[] = [`Open ${target} in the more pager`];

  if (flagBool(spec, "showPrompts")) parts.push("showing helpful prompts");
  if (flagBool(spec, "clearScreen")) parts.push("clearing the screen before each page");
  if (spec.startLine !== undefined && spec.startLine > 0) parts.push(`starting at line ${spec.startLine}`);

  return `${parts.join(", ")}.`;
}
