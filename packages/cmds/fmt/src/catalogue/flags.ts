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
    summary: "Set maximum line width",
    detail: "Set maximum line width",
    order: 10,
    arg: {
      placeholder: "80",
      separator: " ",
    },
  },
  {
    id: "uniformSpacing",
    short: "-u",
    long: "--uniform-spacing",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use uniform spacing",
    detail: "Use uniform spacing",
    order: 20,
  },
  {
    id: "splitOnly",
    short: "-s",
    long: "--split-only",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Split long lines but do not refill",
    detail: "Split long lines but do not refill",
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
