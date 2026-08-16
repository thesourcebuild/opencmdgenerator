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
    id: "delay",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Set update delay in tenths of seconds",
    detail: "Set update delay in tenths of seconds",
    order: 10,
    arg: {
      placeholder: "10",
      separator: " ",
    },
  },
  {
    id: "user",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Show processes for a user",
    detail: "Show processes for a user",
    order: 20,
    arg: {
      placeholder: "alice",
      separator: " ",
    },
  },
  {
    id: "pid",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Show only listed PIDs",
    detail: "Show only listed PIDs",
    order: 30,
    arg: {
      placeholder: "123,456",
      separator: " ",
    },
  },
  {
    id: "sortKey",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Sort by a column",
    detail: "Sort by a column",
    order: 40,
    arg: {
      placeholder: "PERCENT_CPU",
      separator: " ",
    },
  },
  {
    id: "tree",
    short: "-t",
    long: "--tree",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Start in tree view",
    detail: "Start in tree view",
    order: 50,
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
