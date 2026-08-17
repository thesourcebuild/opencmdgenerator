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
    id: "width",
    short: "-w",
    long: "-w",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Set output width",
    detail: "Set output width",
    order: 10,
    arg: {
      placeholder: "120",
      separator: " ",
    },
  },
  {
    id: "suppressCommon",
    short: "-s",
    long: "--suppress-common-lines",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress common lines",
    detail: "Suppress common lines",
    order: 20,
  },
  {
    id: "ignoreCase",
    short: "-i",
    long: "--ignore-case",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Ignore case differences",
    detail: "Ignore case differences",
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
