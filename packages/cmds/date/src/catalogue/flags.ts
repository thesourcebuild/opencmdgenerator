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
    id: "utc",
    short: "-u",
    long: "--utc",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use UTC",
    detail: "Use UTC",
    order: 10,
  },
  {
    id: "rfcEmail",
    short: "-R",
    long: "--rfc-email",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Output RFC email date format",
    detail: "Output RFC email date format",
    order: 20,
  },
  {
    id: "iso",
    short: "-I",
    long: "-I",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Output ISO 8601 format",
    detail: "Output ISO 8601 format",
    order: 30,
    arg: {
      placeholder: "seconds",
      separator: " ",
    },
  },
  {
    id: "dateString",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Display time described by a string",
    detail: "Display time described by a string",
    order: 40,
    arg: {
      placeholder: "yesterday",
      separator: " ",
    },
  },
  {
    id: "reference",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Display a file's modification time",
    detail: "Display a file's modification time",
    order: 50,
    arg: {
      placeholder: "file.txt",
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
