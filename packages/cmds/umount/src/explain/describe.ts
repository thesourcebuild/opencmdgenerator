import type { UmountSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: UmountSpec): string {
  const target = spec.target.trim();
  const all = flagBool(spec, "all");

  const parts: string[] = [];
  if (all) {
    parts.push("Unmount every currently mounted filesystem");
  } else if (target !== "") {
    parts.push(`Unmount ${target}`);
  } else {
    parts.push("Unmount (no target given)");
  }

  const types = flagString(spec, "types");
  if (types) parts.push(`restricted to filesystem type(s) ${types}`);
  if (flagBool(spec, "force")) parts.push("forcing it even if the filesystem is busy");
  if (flagBool(spec, "lazy")) parts.push("detaching it lazily, cleaning up once it's no longer busy");

  return `${parts.join(", ")}.`;
}
