import type { GzipSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: GzipSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILES";
  const decompressing = flagBool(spec, "decompress");

  const parts: string[] = [`${decompressing ? "Decompress" : "Compress"} ${target}`];

  if (spec.compressionLevel !== undefined) parts.push(`using compression level ${spec.compressionLevel}`);
  if (flagBool(spec, "recursive")) parts.push("recursing into directories");
  if (flagBool(spec, "force")) parts.push("forcing overwrite of any existing output");
  if (flagBool(spec, "keep")) parts.push("keeping the original file afterward");

  return `${parts.join(", ")}.`;
}
