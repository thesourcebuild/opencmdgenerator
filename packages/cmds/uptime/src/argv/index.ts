import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { UptimeSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Build the uptime invocation: catalogue flags only — uptime takes no positional arguments at all. */
export function buildArgv(spec: UptimeSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);
  return { binary: "uptime", args };
}
