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
    id: "all",
    short: "-a",
    long: "-a",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show hidden files",
    detail: "Show hidden files",
    order: 10,
  },
  {
    id: "directoriesOnly",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List directories only",
    detail: "List directories only",
    order: 20,
  },
  {
    id: "fullPath",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print full path prefixes",
    detail: "Print full path prefixes",
    order: 30,
  },
  {
    id: "human",
    short: "-h",
    long: "-h",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print human-readable sizes",
    detail: "Print human-readable sizes",
    order: 40,
  },
  {
    id: "sizes",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print file sizes",
    detail: "Print file sizes",
    order: 50,
  },
  {
    id: "level",
    short: "-L",
    long: "-L",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Descend only this many levels",
    detail: "Descend only this many levels",
    order: 60,
    arg: {
      placeholder: "2",
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
