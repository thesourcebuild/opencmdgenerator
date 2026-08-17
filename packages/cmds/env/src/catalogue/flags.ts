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
    id: "ignore",
    short: "-i",
    long: "--ignore-environment",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Start with an empty environment",
    detail: "Start with an empty environment",
    order: 10,
  },
  {
    id: "unset",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Remove a variable",
    detail: "Remove a variable",
    order: 20,
    arg: {
      placeholder: "PATH",
      separator: " ",
    },
  },
  {
    id: "chdir",
    short: "-C",
    long: "-C",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Change directory before running command",
    detail: "Change directory before running command",
    order: 30,
    arg: {
      placeholder: "/tmp",
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
