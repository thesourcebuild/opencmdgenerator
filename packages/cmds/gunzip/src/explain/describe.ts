import type { GunzipSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: GunzipSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILES";
  const listing = flagBool(spec, "list");

  const parts: string[] = [listing ? `List the contents of ${target} without decompressing` : `Decompress ${target}`];

  if (flagBool(spec, "force")) parts.push("forcing overwrite of any existing output");
  if (flagBool(spec, "keep")) parts.push("keeping the .gz file afterward");

  return `${parts.join(", ")}.`;
}
