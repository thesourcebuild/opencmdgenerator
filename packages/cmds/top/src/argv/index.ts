import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { TopSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Build the top invocation: catalogue flags only — top takes no positional arguments at all. */
export function buildArgv(spec: TopSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);
  return { binary: "top", args };
}
