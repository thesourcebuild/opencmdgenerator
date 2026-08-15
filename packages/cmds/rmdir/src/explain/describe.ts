import type { RmdirSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: RmdirSpec): string {
  const paths = spec.paths.filter((p) => p.trim() !== "");
  const target = paths.length > 0 ? paths.join(", ") : "SOME_DIRECTORY";

  const parts: string[] = [`Remove ${target}`];

  if (flagBool(spec, "parents")) parts.push("and then each now-empty parent directory in turn");
  if (flagBool(spec, "ignoreFailOnNonEmpty")) parts.push("without erroring if a directory turns out not to be empty");

  // A genuine, positive safety property worth calling out, not a warning:
  // rmdir can never remove a directory that still has anything in it.
  return `${parts.join(", ")}. rmdir only ever removes empty directories, so nothing with contents can be deleted this way.`;
}
