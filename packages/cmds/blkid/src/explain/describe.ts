import type { BlkidSpec } from "../spec";
import { flagString } from "../pure";

const OUTPUT_LABELS: Record<string, string> = {
  value: "just the matched value",
  device: "just the device name",
  list: "a table",
  udev: "udev-style KEY=VALUE pairs",
};

export function describeSpec(spec: BlkidSpec): string {
  const device = spec.device.trim();
  const target = device !== "" ? device : "every block device";

  const parts: string[] = [`Report filesystem/partition attributes for ${target}`];

  const matchTag = flagString(spec, "matchTag");
  if (matchTag) parts.push(`showing only the ${matchTag} tag`);

  const output = flagString(spec, "output");
  if (output && output !== "none" && OUTPUT_LABELS[output]) parts.push(`formatted as ${OUTPUT_LABELS[output]}`);

  return `${parts.join(", ")}.`;
}
