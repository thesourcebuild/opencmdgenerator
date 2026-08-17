import {
  buildFlagArgs,
  enabledFlagIds as enabledFlagIdsGeneric,
  type Arg,
  type Argv,
} from "@cmdgen/engine";
import type { DpkgSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

export function enabledFlagIds(spec: DpkgSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

export function buildArgv(spec: DpkgSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);
  for (const value of spec.args) {
    const trimmed = value.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "value" });
  }
  return { binary: "dpkg", args };
}
