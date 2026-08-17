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
    id: "ignoreCase",
    short: "-i",
    long: "--ignore-case",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Ignore case distinctions",
    detail: "Ignore case distinctions",
    order: 10,
  },
  {
    id: "lineNumber",
    short: "-n",
    long: "--line-number",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print line numbers",
    detail: "Print line numbers",
    order: 20,
  },
  {
    id: "recursive",
    short: "-r",
    long: "--recursive",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Search directories recursively",
    detail: "Search directories recursively",
    order: 30,
  },
  {
    id: "count",
    short: "-c",
    long: "--count",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print only match counts",
    detail: "Print only match counts",
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
