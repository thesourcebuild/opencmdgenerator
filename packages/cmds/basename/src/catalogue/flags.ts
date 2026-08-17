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
    id: "zero",
    short: "-z",
    long: "--zero",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "End output with NUL instead of newline",
    detail: "End output with NUL instead of newline",
    order: 10,
  },
  {
    id: "suffix",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Remove a trailing suffix",
    detail: "Remove a trailing suffix",
    order: 20,
    arg: {
      placeholder: ".txt",
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
