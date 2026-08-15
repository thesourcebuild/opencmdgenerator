import type { RsyslogdSpec } from "../spec";
import { flagBool, flagNumber, flagString } from "../pure";

/**
 * No inherent destructive danger here — rsyslogd's flags are mostly a
 * debugging/validation toolkit for manual invocation, not a way to damage
 * anything. describeSpec reflects that: it's a plain sentence, never a
 * warning.
 */
export function describeSpec(spec: RsyslogdSpec): string {
  const parts: string[] = ["Run rsyslogd"];

  const checkLevel = flagNumber(spec, "checkConfig");
  if (checkLevel !== undefined) {
    parts.push(`, validating the config (level ${checkLevel}) and exiting without actually starting logging`);
  } else {
    if (flagBool(spec, "foreground")) parts.push(", staying in the foreground instead of daemonizing");
    if (flagBool(spec, "debug")) parts.push(", with verbose internal debug diagnostics");
  }

  const configFile = flagString(spec, "configFile");
  if (configFile !== undefined) parts.push(`, using the config file ${configFile}`);

  return `${parts.join("")}.`;
}
