import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { CdSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: CdSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the cd invocation as ordered, role-tagged tokens. `cd` takes exactly
 * one positional argument (the directory), never a flag=value pair, so it is
 * appended as a bare "path" token — the same pattern rsync uses for its
 * source/destination.
 */
export function buildArgv(spec: CdSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });

  const path = spec.path.trim();
  if (path !== "") {
    args.push({ text: path, role: "path" });
  }

  return { binary: "cd", args };
}
