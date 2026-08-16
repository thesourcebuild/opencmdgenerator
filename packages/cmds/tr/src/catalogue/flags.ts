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
    id: "delete",
    short: "-d",
    long: "--delete",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Delete characters in SET1",
    detail: "Delete characters in SET1",
    order: 10,
  },
  {
    id: "squeeze",
    short: "-s",
    long: "--squeeze-repeats",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Replace repeated characters with one",
    detail: "Replace repeated characters with one",
    order: 20,
  },
  {
    id: "complement",
    short: "-c",
    long: "--complement",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use the complement of SET1",
    detail: "Use the complement of SET1",
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
