import type { NetstatSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: NetstatSpec): string {
  if (flagBool(spec, "route")) return "Show the kernel routing table.";

  const parts: string[] = [];

  if (flagBool(spec, "tcp") && flagBool(spec, "udp")) parts.push("Show TCP and UDP sockets");
  else if (flagBool(spec, "tcp")) parts.push("Show TCP sockets");
  else if (flagBool(spec, "udp")) parts.push("Show UDP sockets");
  else parts.push("Show network connections");

  if (flagBool(spec, "listening")) parts.push("limited to listening sockets");
  if (flagBool(spec, "all")) parts.push("including both listening and non-listening sockets");
  if (flagBool(spec, "numeric")) parts.push("using numeric addresses and ports instead of resolving names");
  if (flagBool(spec, "program")) parts.push("showing the owning program and PID for each socket");

  return `${parts.join(", ")}.`;
}
