import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { UpdatedbSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: UpdatedbSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the updatedb invocation — a bare binary name plus its two path-list flags. No operands at all. */
export function buildArgv(spec: UpdatedbSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);
  return { binary: "updatedb", args };
}
