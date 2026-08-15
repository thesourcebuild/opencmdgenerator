import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { NetstatSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: NetstatSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the netstat invocation: catalogue flags only — netstat has no positional arguments at all. */
export function buildArgv(spec: NetstatSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  return { binary: "netstat", args };
}
