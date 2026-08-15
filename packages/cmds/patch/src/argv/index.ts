import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { PatchSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagString } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: PatchSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the patch invocation: catalogue flags, then the target file, then the
 * patch file — real patch's own operand order is `[origfile [patchfile]]`.
 * When -i/--input is set, the positional patch file is skipped (they're
 * alternatives, same shape as `@cmdgen/chgrp`'s group/--reference exclusivity)
 * so the same source is never named twice.
 */
export function buildArgv(spec: PatchSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const usingInputFlag = flagString(spec, "input") !== undefined;

  const targetFile = spec.targetFile.trim();
  if (targetFile !== "") args.push({ text: targetFile, role: "path" });

  const patchFile = spec.patchFile.trim();
  if (!usingInputFlag && patchFile !== "") args.push({ text: patchFile, role: "path" });

  return { binary: "patch", args };
}
