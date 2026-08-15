import type { PkillSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: PkillSpec): string {
  const pattern = spec.pattern.trim();
  const target = pattern !== "" ? pattern : "SOME_PATTERN";

  const signal = flagString(spec, "signal");
  const signalLabel = signal ? (/^\d+$/.test(signal) ? `signal ${signal}` : `SIG${signal.toUpperCase().replace(/^SIG/, "")}`) : "SIGTERM";

  const who = flagBool(spec, "oldest")
    ? `the oldest process matching "${target}"`
    : flagBool(spec, "newest")
      ? `the newest process matching "${target}"`
      : `every process matching "${target}"`;

  const parts: string[] = [`Send ${signalLabel} to ${who}`];

  if (flagBool(spec, "full")) parts.push("matching against the full command line, not just the process name");
  if (flagBool(spec, "exact")) parts.push("requiring an exact match");

  const user = flagString(spec, "user");
  if (user) parts.push(`only matching processes owned by ${user}`);

  return `${parts.join(", ")}.`;
}
