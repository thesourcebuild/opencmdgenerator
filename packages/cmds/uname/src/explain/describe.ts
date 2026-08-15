import type { UnameSpec } from "../spec";
import { flagBool } from "../pure";

const FIELD_LABELS: [string, string][] = [
  ["all", "everything"],
  ["kernelName", "the kernel name"],
  ["nodename", "the network hostname"],
  ["kernelRelease", "the kernel release"],
  ["kernelVersion", "the kernel version"],
  ["machine", "the hardware architecture"],
  ["processor", "the processor type"],
  ["operatingSystem", "the operating system name"],
];

export function describeSpec(spec: UnameSpec): string {
  if (flagBool(spec, "all")) return "Print every piece of system information.";

  const requested = FIELD_LABELS.filter(([id]) => id !== "all" && flagBool(spec, id)).map(([, label]) => label);
  if (requested.length === 0) return "Print the kernel name (the default with no flags).";

  return `Print ${requested.join(", ")}.`;
}
