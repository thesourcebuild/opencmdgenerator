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
 * Exactly one flag, on purpose — see the narrowing note in `spec.ts`. `-l`
 * is the only non-interactive, read-only form of real fdisk this generator
 * models at all.
 */
export const FLAGS: readonly FlagDef[] = [
  {
    id: "list",
    short: "-l",
    long: "--list",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List partition tables for the given device, or every device if none is given.",
    detail:
      "The only non-interactive, read-only form of fdisk this generator supports. Without it, real fdisk opens an interactive partitioning prompt that cannot be represented as a single generated command line — and partition-table edits made there are irreversibly destructive, so that mode is intentionally out of scope here.",
    order: 10,
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
