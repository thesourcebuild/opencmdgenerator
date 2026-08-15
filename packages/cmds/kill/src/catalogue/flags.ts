import { createFlagCatalogue, flagLabel as flagLabelGeneric, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type FlagDef = FlagDefGeneric<FlagGroup>;

/**
 * POSIX kill has no flags worth modeling (see src/spec.ts). PowerShell's
 * Stop-Process gets exactly one: -Force, for stopping a process that would
 * otherwise refuse (e.g. one owned by another user, when elevated).
 */
export const FLAGS: readonly FlagDef[] = [
  {
    id: "forcePs",
    long: "-Force",
    group: "options",
    kind: "boolean",
    availableOn: ["powershell"],
    summary: "Stop the process even if it would otherwise refuse.",
    detail:
      "Stop-Process has no signal concept — this is the closest thing it has to a \"harder\" stop, e.g. for a process owned by another user (elevated only).",
    order: 100,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
