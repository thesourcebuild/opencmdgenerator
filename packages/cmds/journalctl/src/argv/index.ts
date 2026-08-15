import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { JournalctlSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: JournalctlSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the journalctl invocation: catalogue flags, then `-u UNIT` last if a
 * unit is set — matching real journalctl's typical usage
 * (`journalctl -u nginx -f`), and keeping the unit filter visually separate
 * from the rest of the flags, the same reasoning `@cmdgen/tail`'s file
 * arguments come after its flags.
 */
export function buildArgv(spec: JournalctlSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const unit = spec.unit.trim();
  if (unit !== "") {
    args.push({ text: "-u", role: "flag" });
    args.push({ text: unit, role: "value" });
  }

  return { binary: "journalctl", args };
}
