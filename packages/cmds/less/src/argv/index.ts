import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { LessSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: LessSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Build the less invocation: catalogue flags, then every file. */
export function buildArgv(spec: LessSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  for (const file of spec.files) {
    const trimmed = file.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: "less", args };
}
