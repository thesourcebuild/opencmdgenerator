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
    id: "script",
    short: "-s",
    long: "--script",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Never prompt for user intervention",
    detail: "Never prompt for user intervention",
    order: 10,
  },
  {
    id: "list",
    short: "-l",
    long: "--list",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List partition layouts",
    detail: "List partition layouts",
    order: 20,
  },
  {
    id: "machine",
    short: "-m",
    long: "--machine",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Machine-parseable output",
    detail: "Machine-parseable output",
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
