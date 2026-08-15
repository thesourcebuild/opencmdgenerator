import type { MkfsSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: MkfsSpec): string {
  const device = spec.device.trim() || "SOME_DEVICE";
  const type = spec.filesystemType.trim();

  const parts: string[] = [
    type !== ""
      ? `Format ${device} as ${type}, erasing all existing data on it`
      : `Format ${device} with mkfs's own default filesystem type, erasing all existing data on it`,
  ];

  if (flagBool(spec, "check")) parts.push("checking for bad blocks first");
  const label = flagString(spec, "label");
  if (label) parts.push(`labeling it "${label}"`);
  if (flagBool(spec, "force")) parts.push("bypassing mkfs's own safety checks");

  return `${parts.join(", ")}.`;
}
