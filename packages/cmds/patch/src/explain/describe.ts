import type { PatchSpec } from "../spec";
import { flagBool, flagNumber, flagString } from "../pure";

export function describeSpec(spec: PatchSpec): string {
  const target = spec.targetFile.trim() || "the target file";
  const input = flagString(spec, "input");
  const patchFile = spec.patchFile.trim();
  const source = input ?? (patchFile !== "" ? patchFile : "stdin");
  const reverse = flagBool(spec, "reverse");

  const parts: string[] = [
    reverse ? `Un-apply the patch from ${source} to ${target}` : `Apply the patch from ${source} to ${target}`,
  ];

  const strip = flagNumber(spec, "strip");
  if (strip !== undefined) parts.push(`stripping ${strip} leading path component${strip === 1 ? "" : "s"}`);
  if (flagBool(spec, "backup")) parts.push("keeping a backup of the original");
  if (flagBool(spec, "dryRun")) parts.push("as a dry run only, without changing anything");

  return `${parts.join(", ")}.`;
}
