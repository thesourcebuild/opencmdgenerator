import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { ChmodSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagString } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: ChmodSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the chmod invocation as ordered, role-tagged tokens: catalogue
 * flags, then the mode positional, then every file. The mode positional is
 * skipped when --reference is active — real chmod parses `mode | --reference`
 * as alternatives, so emitting both would make chmod treat the mode text as
 * the first FILE argument instead, silently breaking the file list.
 */
export function buildArgv(spec: ChmodSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const usingReference = flagString(spec, "reference") !== undefined;
  const mode = spec.mode.trim();
  if (!usingReference && mode !== "") {
    args.push({ text: mode, role: "value" });
  }

  for (const file of spec.files) {
    const trimmed = file.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: "chmod", args };
}
