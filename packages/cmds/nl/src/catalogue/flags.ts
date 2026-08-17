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
    id: "bodyNumbering",
    short: "-b",
    long: "-b",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Choose body numbering style",
    detail: "Choose body numbering style",
    order: 10,
    arg: {
      placeholder: "a",
      separator: " ",
    },
  },
  {
    id: "numberFormat",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Choose number format",
    detail: "Choose number format",
    order: 20,
    arg: {
      placeholder: "ln",
      separator: " ",
    },
  },
  {
    id: "separator",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Use a custom separator",
    detail: "Use a custom separator",
    order: 30,
    arg: {
      placeholder: ": ",
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
