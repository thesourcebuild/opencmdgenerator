import type { DfSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: DfSpec): string {
  const paths = spec.paths.filter((p) => p.trim() !== "");
  const target = paths.length > 0 ? paths.join(", ") : "every mounted filesystem";

  const parts: string[] = [`Report disk space usage for ${target}`];

  if (flagBool(spec, "humanReadable")) parts.push("using human-readable power-of-1024 units");
  if (flagBool(spec, "siUnits")) parts.push("using human-readable power-of-1000 (SI) units");
  if (flagBool(spec, "inodes")) parts.push("reporting inode usage instead of block usage");
  if (flagBool(spec, "allFilesystems")) parts.push("including pseudo, duplicate, and inaccessible filesystems");
  if (flagBool(spec, "showType")) parts.push("showing each filesystem's type");
  if (flagBool(spec, "total")) parts.push("printing a grand total line at the end");

  return `${parts.join(", ")}.`;
}
