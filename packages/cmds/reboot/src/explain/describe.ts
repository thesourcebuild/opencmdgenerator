import type { RebootSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: RebootSpec): string {
  const parts: string[] = ["Reboot the machine"];
  if (flagBool(spec, "force")) parts.push("immediately, without going through systemd/logind");
  if (flagBool(spec, "noSync")) parts.push("without syncing filesystem buffers first");

  return `${parts.join(", ")}, ending the current session.`;
}
