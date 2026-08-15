import type { ZipSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: ZipSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILES";

  const archiveName = spec.archiveName.trim();
  const archive = archiveName !== "" ? archiveName : "SOME_ARCHIVE.zip";

  const parts: string[] = [`Add ${target} to ${archive}`];

  if (flagBool(spec, "recursive")) parts.push("recursing into directories");
  if (flagBool(spec, "bestCompression")) parts.push("using maximum compression");
  if (flagBool(spec, "noCompression")) parts.push("storing with no compression");

  const exclude = flagString(spec, "exclude");
  if (exclude) parts.push(`excluding files matching "${exclude}"`);

  if (flagBool(spec, "quiet")) parts.push("suppressing most output");
  if (flagBool(spec, "verbose")) parts.push("printing detailed progress for each file added");
  if (flagBool(spec, "encrypt")) parts.push("encrypting archive entries with a password");

  return `${parts.join(", ")}.`;
}
