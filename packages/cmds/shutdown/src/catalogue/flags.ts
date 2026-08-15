import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  type DangerLevel,
  type FlagArgSpec,
  type FlagDef as FlagDefGeneric,
  type FlagEnumOption,
  type FlagKind,
} from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

/**
 * -c/--cancel is NOT here — it is modeled as `spec.action === "cancel"`
 * instead (see `spec.ts` and `argv/index.ts`), since it changes the whole
 * shape of the command (no -h/-r/-k, no time, message means something
 * different) rather than toggling independently alongside them.
 */
export const FLAGS: readonly FlagDef[] = [
  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "halt",
    short: "-h",
    long: "-h",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["reboot"],
    summary: "Halt the machine as part of this shutdown, instead of powering off.",
    detail: "Only meaningful when scheduling a shutdown, not when cancelling one.",
    order: 10,
  },
  {
    id: "reboot",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["halt"],
    summary: "Reboot the machine as part of this shutdown, instead of halting or powering off.",
    detail: "Only meaningful when scheduling a shutdown, not when cancelling one.",
    order: 20,
  },
  {
    id: "dryRun",
    short: "-k",
    long: "-k",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "none",
    summary: "Don't actually halt/power off/reboot — just broadcast the wall warning message.",
    detail:
      "Sends the same wall message real users would see, on the same schedule, but the machine is never actually acted on. Safe to use for testing or drills.",
    order: 30,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
