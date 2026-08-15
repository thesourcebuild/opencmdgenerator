import type { LessSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: LessSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILE";

  const parts: string[] = [`Open ${target} in the less pager`];

  if (flagBool(spec, "lineNumbers")) parts.push("showing line numbers");
  if (flagBool(spec, "chopLongLines")) parts.push("without wrapping long lines");
  if (flagBool(spec, "ignoreCaseAlways")) parts.push("always searching case-insensitively");
  else if (flagBool(spec, "ignoreCase")) parts.push("searching case-insensitively unless the pattern has an uppercase letter");
  if (flagBool(spec, "longPrompt")) parts.push("with a verbose position prompt");
  if (flagBool(spec, "quitIfOneScreen")) parts.push("exiting immediately if it all fits on one screen");
  if (flagBool(spec, "rawControlChars")) parts.push("rendering ANSI color codes as colors");
  if (flagBool(spec, "force")) parts.push("even if it isn't a regular file");

  return `${parts.join(", ")}.`;
}
