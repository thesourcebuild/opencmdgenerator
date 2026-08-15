import type { VmstatSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: VmstatSpec): string {
  const parts: string[] = ["Report virtual memory statistics"];

  if (flagBool(spec, "disk")) parts.push("as a per-disk statistics table");
  if (flagBool(spec, "stats")) parts.push("as a table of event counters and memory statistics");
  if (flagBool(spec, "active")) parts.push("including active/inactive memory");

  if (spec.interval !== undefined) {
    const suffix = spec.count !== undefined ? ` for ${spec.count} updates` : "";
    parts.push(`repeating every ${spec.interval} second${spec.interval === 1 ? "" : "s"}${suffix}`);
  }

  return `${parts.join(", ")}.`;
}
