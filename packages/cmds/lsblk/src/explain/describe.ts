import type { LsblkSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: LsblkSpec): string {
  const parts: string[] = ["List block devices"];

  if (flagBool(spec, "all")) parts.push("including empty ones");
  if (flagBool(spec, "fs")) parts.push("showing filesystem info (type, label, UUID, mountpoint)");

  const output = flagString(spec, "output");
  if (output) parts.push(`showing columns ${output}`);

  if (flagBool(spec, "paths")) parts.push("using full device paths");

  return `${parts.join(", ")}.`;
}
