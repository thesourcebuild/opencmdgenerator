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
    id: "field1",
    short: "-1",
    long: "-1",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Join on this field from file 1",
    detail: "Join on this field from file 1",
    order: 10,
    arg: {
      placeholder: "1",
      separator: " ",
    },
  },
  {
    id: "field2",
    short: "-2",
    long: "-2",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Join on this field from file 2",
    detail: "Join on this field from file 2",
    order: 20,
    arg: {
      placeholder: "1",
      separator: " ",
    },
  },
  {
    id: "separator",
    short: "-t",
    long: "-t",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Use a field separator",
    detail: "Use a field separator",
    order: 30,
    arg: {
      placeholder: ",",
      separator: " ",
    },
  },
  {
    id: "ignoreCase",
    short: "-i",
    long: "-i",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Ignore case when joining",
    detail: "Ignore case when joining",
    order: 40,
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
