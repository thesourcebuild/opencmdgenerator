import type { ShutdownSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: ShutdownSpec): string {
  const message = spec.message.trim();

  if (spec.action === "cancel") {
    return message !== "" ? `Cancel the pending shutdown, broadcasting "${message}".` : "Cancel the pending shutdown.";
  }

  const halt = flagBool(spec, "halt");
  const reboot = flagBool(spec, "reboot");
  const dryRun = flagBool(spec, "dryRun");
  const time = spec.time.trim() || "now";
  const verb = reboot ? "reboot" : halt ? "halt" : "power off";

  let sentence = dryRun
    ? `Broadcast a warning that the machine would ${verb} at ${time}, without actually doing it`
    : `${verb === "power off" ? "Power off" : verb === "halt" ? "Halt" : "Reboot"} the machine at ${time}`;

  if (message !== "") sentence += `, broadcasting "${message}"`;

  return `${sentence}.`;
}
