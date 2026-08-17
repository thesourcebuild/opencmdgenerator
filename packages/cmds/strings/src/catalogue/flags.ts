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
    summary: "Scan the whole file",
    detail: "Scan the whole file",
    order: 10,
  },
  {
    id: "minLength",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Minimum string length",
    detail: "Minimum string length",
    order: 20,
    arg: {
      placeholder: "8",
      separator: " ",
    },
  },
  {
    id: "encoding",
    short: "-e",
    long: "-e",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Select character encoding",
    detail: "Select character encoding",
    order: 30,
    arg: {
      placeholder: "s",
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
