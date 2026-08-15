import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { ChgrpSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagString } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: ChgrpSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the chgrp invocation: catalogue flags, then the group positional,
 * then every path — same shape as `@cmdgen/chown`'s `buildArgv`, including
 * skipping the group positional when --reference is active (real chgrp
 * parses `group | --reference` as alternatives, same as chown's owner).
 */
export function buildArgv(spec: ChgrpSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const usingReference = flagString(spec, "reference") !== undefined;
  const group = spec.group.trim();
  if (!usingReference && group !== "") {
    args.push({ text: group, role: "value" });
  }

  for (const path of spec.paths) {
    const trimmed = path.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: "chgrp", args };
}
