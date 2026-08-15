import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { PkillSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: PkillSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the pkill invocation: catalogue flags, then the match pattern. */
export function buildArgv(spec: PkillSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const pattern = spec.pattern.trim();
  if (pattern !== "") args.push({ text: pattern, role: "pattern" });

  return { binary: "pkill", args };
}
