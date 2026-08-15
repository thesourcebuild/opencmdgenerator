import type { FdiskSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: FdiskSpec): string {
  const device = spec.device.trim();
  const target = device !== "" ? device : "every device fdisk can find";

  if (!flagBool(spec, "list")) {
    return device !== ""
      ? `Open an interactive partitioning session for ${device} (not representable as a single generated command — this generator only supports the read-only -l form).`
      : "Open an interactive partitioning session (not representable as a single generated command — this generator only supports the read-only -l form).";
  }

  return `List the partition table for ${target}.`;
}
