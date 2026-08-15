import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { DiffSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagTag } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: DiffSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the diff invocation: catalogue flags, then the two files, in order. */
export function buildArgv(spec: DiffSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: flagTag(spec.platform) });

  const file1 = spec.file1.trim();
  const file2 = spec.file2.trim();
  if (file1 !== "") args.push({ text: file1, role: "path" });
  if (file2 !== "") args.push({ text: file2, role: "path" });

  return { binary: spec.platform === "windows-cmd" ? "fc" : "diff", args };
}
