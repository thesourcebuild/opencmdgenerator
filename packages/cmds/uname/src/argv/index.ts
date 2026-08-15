import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { UnameSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Build the uname invocation: catalogue flags only — uname takes no positional arguments at all. */
export function buildArgv(spec: UnameSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);
  return { binary: "uname", args };
}
