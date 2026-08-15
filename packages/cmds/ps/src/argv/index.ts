import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { PsSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Build the ps invocation: catalogue flags only — ps takes no positional arguments at all. */
export function buildArgv(spec: PsSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);
  return { binary: "ps", args };
}
