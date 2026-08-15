import type { TracerouteSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: TracerouteSpec): string {
  const host = spec.host.trim();
  const target = host !== "" ? host : "SOME_HOST";

  const parts: string[] = [`Trace the network path to ${target}`];

  if (flagBool(spec, "numeric") || flagBool(spec, "noResolve")) {
    parts.push("skipping DNS lookups for hop addresses");
  }

  const maxHops = flagString(spec, "maxHops") ?? flagString(spec, "maxHopsWin");
  if (maxHops) parts.push(`probing at most ${maxHops} hops`);

  const waitTime = flagString(spec, "waitTime");
  if (waitTime) parts.push(`waiting up to ${waitTime}s for each probe's reply`);
  const waitTimeWin = flagString(spec, "waitTimeWin");
  if (waitTimeWin) parts.push(`waiting up to ${waitTimeWin}ms for each reply`);

  if (flagBool(spec, "icmp")) parts.push("using ICMP ECHO probes instead of UDP");
  if (flagBool(spec, "ipv4")) parts.push("forcing IPv4");
  else if (flagBool(spec, "ipv6")) parts.push("forcing IPv6");

  return `${parts.join(", ")}.`;
}
