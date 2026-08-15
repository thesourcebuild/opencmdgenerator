import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { RmSpec } from "../spec";
import { flagTag } from "../pure";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

export function enabledFlagIds(spec: RmSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the rm invocation: catalogue flags (gated to the current platform), then each target path. */
export function buildArgv(spec: RmSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: flagTag(spec.platform) });

  for (const path of spec.paths) {
    const trimmed = path.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: spec.platform === "windows-powershell" ? "Remove-Item" : "rm", args };
}
