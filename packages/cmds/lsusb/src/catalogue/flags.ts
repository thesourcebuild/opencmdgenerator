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
    id: "verbose",
    short: "-v",
    long: "--verbose",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show verbose descriptors",
    detail: "Show verbose descriptors",
    order: 10,
  },
  {
    id: "tree",
    short: "-t",
    long: "--tree",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show USB device tree",
    detail: "Show USB device tree",
    order: 20,
  },
  {
    id: "device",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Show only matching vendor/product ID",
    detail: "Show only matching vendor/product ID",
    order: 30,
    arg: {
      placeholder: "046d",
      separator: " ",
    },
  },
  {
    id: "busDevice",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Show only a bus/device",
    detail: "Show only a bus/device",
    order: 40,
    arg: {
      placeholder: "001",
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
