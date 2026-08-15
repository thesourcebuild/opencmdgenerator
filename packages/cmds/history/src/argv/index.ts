import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { HistorySpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: HistorySpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the history invocation: catalogue flags, then the bare entry count, if any. */
export function buildArgv(spec: HistorySpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  if (spec.count !== undefined) args.push({ text: String(spec.count), role: "value" });

  return { binary: "history", args };
}
