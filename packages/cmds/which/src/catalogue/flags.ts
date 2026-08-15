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

export const FLAGS: readonly FlagDef[] = [
  {
    id: "all",
    short: "-a",
    long: "-a",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print every matching executable in PATH, not just the first.",
    detail: "Without this, which stops at the first directory in PATH that has a match.",
    order: 10,
  },
  {
    id: "silent",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print nothing; only set the exit status.",
    detail: "Exits 0 if every given name was found, non-zero otherwise — useful in scripts that only need the check, not the path.",
    order: 20,
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
