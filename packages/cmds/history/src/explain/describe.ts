import type { HistorySpec } from "../spec";
import { flagBool, flagNumber } from "../pure";

export function describeSpec(spec: HistorySpec): string {
  const offset = flagNumber(spec, "deleteOffset");
  if (offset !== undefined) return `Delete history entry ${offset}.`;

  if (flagBool(spec, "clear")) return "Clear the entire history list for the current session.";

  if (spec.count !== undefined) return `Show the last ${spec.count} commands from the history list.`;

  return "Show the shell's command history.";
}
