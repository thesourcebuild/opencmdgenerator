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
 * Genuinely empty. Real `service` syntax is `service NAME ACTION` — two bare
 * words with no leading dash anywhere, nothing the generic catalogue-flag
 * renderer (`buildFlagArgs`, built around `--flag`/`--flag=value`) has any
 * way to produce. Both operands are modeled as plain spec-level fields
 * instead (see `spec.ts` and `argv/index.ts`), and this catalogue simply has
 * nothing in it — same shape as `@cmdgen/dd`'s empty catalogue.
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
