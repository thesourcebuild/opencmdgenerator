import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { CommSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: CommSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the comm invocation: catalogue flags, then the two files, in order. */
export function buildArgv(spec: CommSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const file1 = spec.file1.trim();
  const file2 = spec.file2.trim();
  if (file1 !== "") args.push({ text: file1, role: "path" });
  if (file2 !== "") args.push({ text: file2, role: "path" });

  return { binary: "comm", args };
}
