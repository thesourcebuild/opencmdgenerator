import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { CalSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/**
 * Build the cal invocation: catalogue flags, then month and year, in order.
 * Real cal treats a single bare numeric argument as a year, so when only
 * `year` is set (month left blank) it still renders as one bare value —
 * which already matches that behavior, so no special-casing is needed.
 */
export function buildArgv(spec: CalSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });

  const month = spec.month.trim();
  const year = spec.year.trim();
  if (month !== "") args.push({ text: month, role: "value" });
  if (year !== "") args.push({ text: year, role: "value" });

  return { binary: "cal", args };
}
