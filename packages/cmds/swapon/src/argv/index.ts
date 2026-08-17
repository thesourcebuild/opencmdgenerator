import {
  buildFlagArgs,
  enabledFlagIds as enabledFlagIdsGeneric,
  type Arg,
  type Argv,
} from "@cmdgen/engine";
import type { SwaponSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

export function enabledFlagIds(spec: SwaponSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

export function buildArgv(spec: SwaponSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);
  for (const value of spec.args) {
    const trimmed = value.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "value" });
  }
  return { binary: "swapon", args };
}
