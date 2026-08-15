import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { GroupmodSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: GroupmodSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the groupmod invocation: catalogue flags, then the group name. */
export function buildArgv(spec: GroupmodSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const groupname = spec.groupname.trim();
  if (groupname !== "") args.push({ text: groupname, role: "value" });

  return { binary: "groupmod", args };
}
