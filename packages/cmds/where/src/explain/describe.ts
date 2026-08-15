import type { WhereSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: WhereSpec): string {
  const patterns = spec.patterns.map((p) => p.trim()).filter((p) => p !== "");
  const target = patterns.length === 0 ? "SOME_PATTERN" : patterns.length === 1 ? patterns[0]! : `${patterns.length} patterns`;

  const parts: string[] = [`Search for ${target} along PATH`];

  const recursive = flagString(spec, "recursive");
  if (recursive) parts.push(`recursively under ${recursive}`);

  if (flagBool(spec, "quiet")) {
    parts.push("printing nothing and only setting the exit code");
  } else {
    if (flagBool(spec, "quotedFilenames")) parts.push("quoting each matched filename");
    if (flagBool(spec, "showDetails")) parts.push("showing file size and last-modified time for each match");
  }

  return `${parts.join(", ")}.`;
}
