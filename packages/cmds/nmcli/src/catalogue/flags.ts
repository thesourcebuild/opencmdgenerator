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
    id: "terse",
    short: "-t",
    long: "--terse",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use terse output",
    detail: "Use terse output",
    order: 10,
  },
  {
    id: "fields",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Select fields",
    detail: "Select fields",
    order: 20,
    arg: {
      placeholder: "NAME,TYPE",
      separator: " ",
    },
  },
  {
    id: "pretty",
    short: "-p",
    long: "--pretty",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Pretty output",
    detail: "Pretty output",
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
