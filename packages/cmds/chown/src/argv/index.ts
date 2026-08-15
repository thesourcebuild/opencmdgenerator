import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { ChownSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagString } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: ChownSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the chown invocation: catalogue flags, then the owner positional,
 * then every file — same shape as `@cmdgen/chmod`'s `buildArgv`, including
 * skipping the owner positional when --reference is active (real chown
 * parses `owner | --reference` as alternatives, same as chmod's mode).
 */
export function buildArgv(spec: ChownSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const usingReference = flagString(spec, "reference") !== undefined;
  const owner = spec.owner.trim();
  if (!usingReference && owner !== "") {
    args.push({ text: owner, role: "value" });
  }

  for (const file of spec.files) {
    const trimmed = file.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: "chown", args };
}
