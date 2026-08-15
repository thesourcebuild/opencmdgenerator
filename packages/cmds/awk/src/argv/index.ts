import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { AwkSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: AwkSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the awk invocation: catalogue flags (-F, --posix), then every -v
 * assignment (not a catalogue flag — see spec.ts), then the program, then
 * every file.
 */
export function buildArgv(spec: AwkSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  for (const assignment of spec.assignments) {
    const trimmed = assignment.trim();
    if (trimmed === "") continue;
    args.push({ text: "-v", role: "flag" }, { text: trimmed, role: "value" });
  }

  const program = spec.program.trim();
  if (program !== "") args.push({ text: program, role: "pattern" });

  for (const file of spec.files) {
    const trimmed = file.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: "awk", args };
}
