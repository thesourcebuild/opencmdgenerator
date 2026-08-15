import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { FreeSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Build the free invocation: catalogue flags only — free takes no positional arguments at all. */
export function buildArgv(spec: FreeSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);
  return { binary: "free", args };
}
