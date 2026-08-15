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
 * Genuinely empty. Every one of dd's operands renders as a bare `KEY=VALUE`
 * token with no leading dash (if=, of=, bs=, count=, skip=, conv=, status=),
 * which the generic catalogue-flag renderer (`buildFlagArgs`, built around
 * `--flag=value`) has no way to produce — so they are modeled as spec-level
 * string fields instead (see `spec.ts` and `argv/index.ts`), and this
 * catalogue simply has nothing in it.
 */
export const FLAGS: readonly FlagDef[] = [] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
