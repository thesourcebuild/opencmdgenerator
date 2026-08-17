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
    id: "label",
    short: "-L",
    long: "-L",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Set filesystem label",
    detail: "Set filesystem label",
    order: 10,
    arg: {
      placeholder: "DATA",
      separator: " ",
    },
  },
  {
    id: "uuid",
    short: "-U",
    long: "-U",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Set filesystem UUID",
    detail: "Set filesystem UUID",
    order: 20,
    arg: {
      placeholder: "random",
      separator: " ",
    },
  },
  {
    id: "maxMountCount",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Set max mount count",
    detail: "Set max mount count",
    order: 30,
    arg: {
      placeholder: "30",
      separator: " ",
    },
  },
  {
    id: "interval",
    short: "-i",
    long: "-i",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Set check interval",
    detail: "Set check interval",
    order: 40,
    arg: {
      placeholder: "1m",
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
