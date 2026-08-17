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
    id: "single",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Return one PID only",
    detail: "Return one PID only",
    order: 10,
  },
  {
    id: "omit",
    short: "-o",
    long: "-o",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Omit selected PIDs",
    detail: "Omit selected PIDs",
    order: 20,
    arg: {
      placeholder: "%PPID",
      separator: " ",
    },
  },
  {
    id: "separator",
    short: "-S",
    long: "-S",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Use output separator",
    detail: "Use output separator",
    order: 30,
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
