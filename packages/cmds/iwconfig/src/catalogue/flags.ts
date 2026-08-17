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
    id: "essid",
    short: "essid",
    long: "essid",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Set ESSID",
    detail: "Set ESSID",
    order: 10,
    arg: {
      placeholder: "MyWifi",
      separator: " ",
    },
  },
  {
    id: "mode",
    short: "mode",
    long: "mode",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Set operating mode",
    detail: "Set operating mode",
    order: 20,
    arg: {
      placeholder: "Managed",
      separator: " ",
    },
  },
  {
    id: "key",
    short: "key",
    long: "key",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Set encryption key",
    detail: "Set encryption key",
    order: 30,
    arg: {
      placeholder: "off",
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
