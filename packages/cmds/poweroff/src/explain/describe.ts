import type { PoweroffSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: PoweroffSpec): string {
  if (flagBool(spec, "wtmpOnly")) {
    return "Only record a power-off in wtmp — the machine is not actually powered off.";
  }

  const parts: string[] = ["Power off the machine"];
  if (flagBool(spec, "force")) parts.push("immediately, without going through systemd/logind");
  if (flagBool(spec, "noSync")) parts.push("without syncing filesystem buffers first");

  return `${parts.join(", ")}, ending the current session.`;
}
