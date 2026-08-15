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
 * Genuinely empty. ufw's real syntax is almost entirely bare-word
 * subcommands (`ufw enable`, `ufw allow 22/tcp`, `ufw deny 8080`) with no
 * `-flag`-style options at all — so mode/port/protocol are modeled as
 * spec-level fields instead (see `spec.ts` and `argv/index.ts`), and this
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
