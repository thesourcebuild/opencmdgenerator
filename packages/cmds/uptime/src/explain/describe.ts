import type { UptimeSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: UptimeSpec): string {
  if (flagBool(spec, "since")) return "Show the system boot time.";
  if (flagBool(spec, "pretty")) return "Show how long the system has been up, in a human-friendly phrase.";
  return "Show the current time, how long the system has been up, logged-in users, and load averages.";
}
