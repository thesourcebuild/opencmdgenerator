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
    summary: "Change attributes recursively",
    detail: "Change attributes recursively",
    order: 10,
  },
  {
    id: "verbose",
    short: "-V",
    long: "-V",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Verbose output",
    detail: "Verbose output",
    order: 20,
  },
  {
    id: "version",
    short: "-v",
    long: "-v",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Set file version/generation number",
    detail: "Set file version/generation number",
    order: 30,
    arg: {
      placeholder: "1",
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
