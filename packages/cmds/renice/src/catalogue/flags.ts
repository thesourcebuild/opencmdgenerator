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
    id: "pid",
    short: "-p",
    long: "--pid",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Treat targets as process IDs",
    detail: "Treat targets as process IDs",
    order: 10,
  },
  {
    id: "user",
    short: "-u",
    long: "--user",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Treat targets as users",
    detail: "Treat targets as users",
    order: 20,
  },
  {
    id: "group",
    short: "-g",
    long: "--pgrp",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Treat targets as process groups",
    detail: "Treat targets as process groups",
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
