import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { VmstatSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/**
 * Build the vmstat invocation: catalogue flags, then `delay` and `count` as
 * bare positionals — real vmstat's grammar is `vmstat [options] [delay
 * [count]]`, so `count` only renders when `delay` is also set; a lone count
 * with no delay has no positional slot to occupy (see VMS002 in
 * lint/rules.ts, which flags exactly that case instead of guessing a
 * placement for it).
 */
export function buildArgv(spec: VmstatSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  if (spec.interval !== undefined) {
    args.push({ text: String(spec.interval), role: "value" });
    if (spec.count !== undefined) args.push({ text: String(spec.count), role: "value" });
  }

  return { binary: "vmstat", args };
}
