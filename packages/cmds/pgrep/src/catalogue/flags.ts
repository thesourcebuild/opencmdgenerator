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
    id: "full",
    short: "-f",
    long: "--full",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Match full command line",
    detail: "Match full command line",
    order: 10,
  },
  {
    id: "ignoreCase",
    short: "-i",
    long: "--ignore-case",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Ignore case",
    detail: "Ignore case",
    order: 20,
  },
  {
    id: "listName",
    short: "-l",
    long: "--list-name",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List PID and process name",
    detail: "List PID and process name",
    order: 30,
  },
  {
    id: "listFull",
    short: "-a",
    long: "--list-full",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List PID and full command line",
    detail: "List PID and full command line",
    order: 40,
  },
  {
    id: "euid",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Match effective user IDs",
    detail: "Match effective user IDs",
    order: 50,
    arg: {
      placeholder: "root",
      separator: " ",
    },
  },
  {
    id: "exact",
    short: "-x",
    long: "--exact",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Require exact process-name match",
    detail: "Require exact process-name match",
    order: 60,
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
