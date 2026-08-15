import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { WhichSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: WhichSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the which invocation: catalogue flags, then every non-empty name, in order. */
export function buildArgv(spec: WhichSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  for (const raw of spec.names) {
    const name = raw.trim();
    if (name !== "") args.push({ text: name, role: "value" });
  }

  return { binary: "which", args };
}
