import type { KillallSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: KillallSpec): string {
  const processName = spec.processName.trim();
  const target = processName !== "" ? processName : "SOME_PROCESS";

  const parts: string[] = [`Send SIGTERM to every process named ${target}`];

  const signal = flagString(spec, "signal");
  if (signal) {
    const label = /^\d+$/.test(signal) ? `signal ${signal}` : `SIG${signal.toUpperCase()}`;
    parts.push(`sending ${label} instead of the default SIGTERM`);
  }

  if (flagBool(spec, "interactive")) parts.push("asking for confirmation before each kill");
  if (flagBool(spec, "quiet")) parts.push("without complaining if nothing matches");
  if (flagBool(spec, "verbose")) parts.push("reporting whether each signal was successfully sent");

  const olderThan = flagString(spec, "olderThan");
  if (olderThan) parts.push(`only matching processes older than ${olderThan}`);

  const youngerThan = flagString(spec, "youngerThan");
  if (youngerThan) parts.push(`only matching processes younger than ${youngerThan}`);

  const user = flagString(spec, "user");
  if (user) parts.push(`only matching processes owned by ${user}`);

  return `${parts.join(", ")}.`;
}
