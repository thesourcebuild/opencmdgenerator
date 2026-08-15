import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { LocateSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: LocateSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the locate invocation: catalogue flags, then the pattern. -r/--regexp
 * renders as a bare "-r" token like any other boolean flag; because the
 * pattern always follows as its own token afterward, the combined output
 * naturally reads as real locate's own `-r REGEXP` grammar with no special
 * casing needed here.
 */
export function buildArgv(spec: LocateSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const pattern = spec.pattern.trim();
  if (pattern !== "") args.push({ text: pattern, role: "pattern" });

  return { binary: "locate", args };
}
