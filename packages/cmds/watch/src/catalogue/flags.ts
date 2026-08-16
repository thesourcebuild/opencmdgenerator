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
    id: "interval",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Seconds between updates",
    detail: "Seconds between updates",
    order: 10,
    arg: {
      placeholder: "2",
      separator: " ",
    },
  },
  {
    id: "differences",
    short: "-d",
    long: "--differences",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Highlight differences between updates",
    detail: "Highlight differences between updates",
    order: 20,
  },
  {
    id: "precise",
    short: "-p",
    long: "--precise",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Run at precise intervals",
    detail: "Run at precise intervals",
    order: 30,
  },
  {
    id: "noTitle",
    short: "-t",
    long: "--no-title",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Hide the header",
    detail: "Hide the header",
    order: 40,
  },
  {
    id: "color",
    short: "-c",
    long: "--color",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Interpret ANSI color sequences",
    detail: "Interpret ANSI color sequences",
    order: 50,
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
