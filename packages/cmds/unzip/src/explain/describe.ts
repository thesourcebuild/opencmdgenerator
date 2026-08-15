import type { UnzipSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: UnzipSpec): string {
  const archiveName = spec.archiveName.trim() !== "" ? spec.archiveName.trim() : "SOME_ARCHIVE.zip";
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "every entry";

  const parts: string[] = [`Extract ${target} from ${archiveName}`];

  if (flagBool(spec, "list")) parts.push("only listing the contents rather than extracting");
  if (flagBool(spec, "test")) parts.push("only testing the archive's integrity rather than extracting");
  if (flagBool(spec, "verboseList")) parts.push("listing the contents verbosely rather than extracting");
  if (flagBool(spec, "extractToPipe")) parts.push("writing to stdout instead of to disk");
  if (flagBool(spec, "freshen")) parts.push("only freshening files that already exist on disk");
  if (flagBool(spec, "update")) parts.push("updating out-of-date files and creating any that are missing");
  if (flagBool(spec, "commentOnly")) parts.push("only displaying the archive's comment");

  if (flagBool(spec, "overwrite")) parts.push("overwriting existing files without prompting");
  if (flagBool(spec, "neverOverwrite")) parts.push("never overwriting existing files");

  const directory = flagString(spec, "directory");
  if (directory) parts.push(`into ${directory}`);

  if (flagBool(spec, "quiet")) parts.push("suppressing most output");
  if (flagBool(spec, "veryQuiet")) parts.push("suppressing nearly all output");
  if (flagBool(spec, "junkPaths")) parts.push("junking paths, flattening every entry into one directory");
  if (flagBool(spec, "caseInsensitive")) parts.push("matching names case-insensitively");
  if (flagBool(spec, "lowercaseNames")) parts.push("lowercasing extracted filenames");

  const password = flagString(spec, "password");
  if (password) parts.push(`decrypting entries with the password ${password}`);

  const exclude = flagString(spec, "exclude");
  if (exclude) parts.push(`excluding entries matching ${exclude}`);

  return `${parts.join(", ")}.`;
}
