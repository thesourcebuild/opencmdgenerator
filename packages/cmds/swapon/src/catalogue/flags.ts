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
    id: "all",
    short: "-a",
    long: "--all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Enable all swap entries",
    detail: "Enable all swap entries",
    order: 10,
  },
  {
    id: "priority",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Set swap priority",
    detail: "Set swap priority",
    order: 20,
    arg: {
      placeholder: "10",
      separator: " ",
    },
  },
  {
    id: "show",
    short: "-s",
    long: "--summary",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show swap summary",
    detail: "Show swap summary",
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
