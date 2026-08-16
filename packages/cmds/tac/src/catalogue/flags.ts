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
    id: "before",
    short: "-b",
    long: "--before",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Attach separator before each record",
    detail: "Attach separator before each record",
    order: 10,
  },
  {
    id: "regex",
    short: "-r",
    long: "--regex",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Treat separator as a regular expression",
    detail: "Treat separator as a regular expression",
    order: 20,
  },
  {
    id: "separator",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Use a custom record separator",
    detail: "Use a custom record separator",
    order: 30,
    arg: {
      placeholder: "---",
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
