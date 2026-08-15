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
 * Genuinely empty. Real `route` syntax is bare words — `route`, `route add
 * DEST gw GW`, `route del DEST gw GW` — nothing the generic catalogue-flag
 * renderer (`buildFlagArgs`, built around `--flag`/`--flag=value`) has any
 * way to produce. `action`/`destination`/`gateway` are modeled as plain
 * spec-level fields instead (see `spec.ts` and `argv/index.ts`), and this
 * catalogue simply has nothing in it — same shape as `@cmdgen/service`'s
 * empty catalogue.
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
