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
    id: "verbose",
    short: "-v",
    long: "-v",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show verbose information",
    detail: "Show verbose information",
    order: 10,
  },
  {
    id: "veryVerbose",
    short: "-vv",
    long: "-vv",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show very verbose information",
    detail: "Show very verbose information",
    order: 20,
  },
  {
    id: "kernel",
    short: "-k",
    long: "-k",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show kernel drivers",
    detail: "Show kernel drivers",
    order: 30,
  },
  {
    id: "numeric",
    short: "-nn",
    long: "-nn",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show numeric IDs",
    detail: "Show numeric IDs",
    order: 40,
  },
  {
    id: "tree",
    short: "-t",
    long: "-t",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show bus tree",
    detail: "Show bus tree",
    order: 50,
  },
  {
    id: "slot",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Show only devices in this slot",
    detail: "Show only devices in this slot",
    order: 60,
    arg: {
      placeholder: "00",
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
