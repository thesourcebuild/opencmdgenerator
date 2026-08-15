import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { PwdSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagTag } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: PwdSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the pwd invocation. `pwd` takes no positional arguments at all —
 * just the (POSIX-only) -L/-P flag. `Get-Location` takes none either.
 */
export function buildArgv(spec: PwdSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: flagTag(spec.platform) });
  return { binary: spec.platform === "windows-powershell" ? "Get-Location" : "pwd", args };
}
