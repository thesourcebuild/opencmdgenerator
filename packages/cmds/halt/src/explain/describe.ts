import type { HaltSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: HaltSpec): string {
  if (flagBool(spec, "wtmpOnly")) {
    return "Only record a halt in wtmp — the machine is not actually halted.";
  }

  const parts: string[] = ["Halt the machine"];
  if (flagBool(spec, "force")) parts.push("immediately, without going through systemd/logind");
  if (flagBool(spec, "noSync")) parts.push("without syncing filesystem buffers first");

  return `${parts.join(", ")}, ending the current session.`;
}
