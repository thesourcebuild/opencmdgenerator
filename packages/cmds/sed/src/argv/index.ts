import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { SedSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { expressions } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: SedSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the sed invocation: catalogue flags (-n, -r), then -i (with its
 * optional attached suffix — not a catalogue flag, see spec.ts), then every
 * expression, then every file. A single expression renders bare, matching
 * the common `sed 'script' file` shape; two or more each get their own
 * explicit -e so the boundary between them is unambiguous.
 */
export function buildArgv(spec: SedSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  if (spec.inPlace) {
    const suffix = spec.backupSuffix.trim();
    args.push({ text: suffix === "" ? "-i" : `-i${suffix}`, role: "flag" });
  }

  const exprs = expressions(spec);
  if (exprs.length === 1) {
    args.push({ text: exprs[0]!, role: "pattern" });
  } else {
    for (const expr of exprs) {
      args.push({ text: "-e", role: "flag" }, { text: expr, role: "pattern" });
    }
  }

  for (const file of spec.files) {
    const trimmed = file.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: "sed", args };
}
