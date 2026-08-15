import type { LsSpec } from "../spec";
import { flagBool, flagEnum } from "../pure";

export function describeSpec(spec: LsSpec): string {
  const targets = spec.paths.filter((p) => p.trim() !== "");
  const where = targets.length === 0 ? "the current directory" : targets.length === 1 ? targets[0] : `${targets.length} paths`;

  const parts: string[] = [`List ${where}`];

  if (spec.platform === "windows-powershell") {
    if (flagBool(spec, "forceHiddenPs")) parts.push("including hidden and system entries");
    if (flagBool(spec, "directoryOnlyPs")) parts.push("showing only directories");
    else if (flagBool(spec, "fileOnlyPs")) parts.push("showing only files");
    if (flagBool(spec, "recursePs")) parts.push("recursing into subdirectories");
    if (flagBool(spec, "nameOnlyPs")) parts.push("printing just the names");
    return `${parts.join(", ")} (PowerShell).`;
  }

  if (flagBool(spec, "long")) parts.push("in long format");
  if (flagBool(spec, "all")) parts.push("including hidden entries");
  else if (flagBool(spec, "almostAll")) parts.push("including hidden entries (but not . or ..)");
  if (flagBool(spec, "recursive")) parts.push("recursing into subdirectories");
  if (flagBool(spec, "directory")) parts.push("showing directories themselves, not their contents");

  const sort = flagEnum(spec, "sortBy", ["time", "size", "extension", "none"]);
  if (sort) parts.push(`sorted by ${sort === "none" ? "directory order" : sort}`);
  if (flagBool(spec, "reverse")) parts.push("in reverse order");

  return `${parts.join(", ")}.`;
}
