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
    id: "type",
    short: "-t",
    long: "-t",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Show selected DMI type",
    detail: "Show selected DMI type",
    order: 10,
    arg: {
      placeholder: "system",
      separator: " ",
    },
  },
  {
    id: "string",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Show a selected DMI string",
    detail: "Show a selected DMI string",
    order: 20,
    arg: {
      placeholder: "system-serial-number",
      separator: " ",
    },
  },
  {
    id: "quiet",
    short: "-q",
    long: "--quiet",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Less verbose output",
    detail: "Less verbose output",
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
