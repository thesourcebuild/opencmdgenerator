import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { SourceSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. Always empty — source has no flags. */
export function enabledFlagIds(spec: SourceSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the source invocation: the script (a bare positional, same shape as
 * cd's one path argument), then every positional argument passed through to
 * it — exposed inside the script as $1, $2, ...
 */
export function buildArgv(spec: SourceSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const file = spec.file.trim();
  if (file !== "") args.push({ text: file, role: "path" });

  for (const arg of spec.args) {
    const trimmed = arg.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "value" });
  }

  return { binary: "source", args };
}
