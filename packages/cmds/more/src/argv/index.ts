import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { MoreSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: MoreSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the more invocation: catalogue flags, then an optional leading +<n>
 * (must come before the file arguments — real more grammar), then every
 * file.
 */
export function buildArgv(spec: MoreSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  if (spec.startLine !== undefined && spec.startLine > 0) {
    args.push({ text: `+${spec.startLine}`, role: "value" });
  }

  for (const file of spec.files) {
    const trimmed = file.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: "more", args };
}
