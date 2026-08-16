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
    id: "short",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use short output format",
    detail: "Use short output format",
    order: 10,
  },
  {
    id: "long",
    short: "-l",
    long: "-l",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use long output format",
    detail: "Use long output format",
    order: 20,
  },
  {
    id: "noPlan",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not show plan or project files",
    detail: "Do not show plan or project files",
    order: 30,
  },
  {
    id: "noHeaders",
    short: "-h",
    long: "-h",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress column headers",
    detail: "Suppress column headers",
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
