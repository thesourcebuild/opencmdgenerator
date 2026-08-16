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
    id: "serial",
    short: "-s",
    long: "--serial",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Paste one file at a time",
    detail: "Paste one file at a time",
    order: 10,
  },
  {
    id: "delimiters",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Use custom delimiter characters",
    detail: "Use custom delimiter characters",
    order: 20,
    arg: {
      placeholder: ",",
      separator: " ",
    },
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
