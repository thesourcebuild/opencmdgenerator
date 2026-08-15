import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { GroupaddSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: GroupaddSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the groupadd invocation: catalogue flags, then the group name. */
export function buildArgv(spec: GroupaddSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const groupname = spec.groupname.trim();
  if (groupname !== "") args.push({ text: groupname, role: "value" });

  return { binary: "groupadd", args };
}
