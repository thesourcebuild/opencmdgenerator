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
    id: "output",
    short: "-o",
    long: "-o",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Set output directory",
    detail: "Set output directory",
    order: 10,
    arg: {
      placeholder: "out",
      separator: " ",
    },
  },
  {
    id: "password",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Use archive password",
    detail: "Use archive password",
    order: 20,
    arg: {
      placeholder: "secret",
      separator: " ",
    },
  },
  {
    id: "recursive",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Recurse subdirectories",
    detail: "Recurse subdirectories",
    order: 30,
  },
  {
    id: "yes",
    short: "-y",
    long: "-y",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Assume yes to prompts",
    detail: "Assume yes to prompts",
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
