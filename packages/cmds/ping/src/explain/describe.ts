import type { PingSpec } from "../spec";
import { flagString } from "../pure";

export function describeSpec(spec: PingSpec): string {
  const host = spec.host.trim();
  const target = host !== "" ? host : "SOME_HOST";

  const parts: string[] = [`Ping ${target}`];

  const count = flagString(spec, "count");
  if (count) parts.push(`sending ${count} packets`);
  else parts.push("continuously, until manually interrupted");

  const interval = flagString(spec, "interval");
  if (interval) parts.push(`waiting ${interval}s between packets`);

  const timeout = flagString(spec, "timeout");
  if (timeout) parts.push(`timing out after ${timeout}s per reply`);

  const size = flagString(spec, "size");
  if (size) parts.push(`using a packet size of ${size} bytes`);

  return `${parts.join(", ")}.`;
}
