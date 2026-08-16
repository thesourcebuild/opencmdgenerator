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
    id: "noAutoLogin",
    short: "-K",
    long: "-K",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not auto-login",
    detail: "Do not auto-login",
    order: 10,
  },
  {
    id: "eightBit",
    short: "-8",
    long: "-8",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use 8-bit data path",
    detail: "Use 8-bit data path",
    order: 20,
  },
  {
    id: "debug",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Enable socket debugging",
    detail: "Enable socket debugging",
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
