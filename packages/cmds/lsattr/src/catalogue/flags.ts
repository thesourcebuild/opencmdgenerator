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
    id: "recursive",
    short: "-R",
    long: "-R",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List attributes recursively",
    detail: "List attributes recursively",
    order: 10,
  },
  {
    id: "all",
    short: "-a",
    long: "-a",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Include hidden files",
    detail: "Include hidden files",
    order: 20,
  },
  {
    id: "directory",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List directories like files",
    detail: "List directories like files",
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
