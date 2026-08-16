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
    id: "null",
    short: "-0",
    long: "--null",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Input items are NUL-terminated",
    detail: "Input items are NUL-terminated",
    order: 10,
  },
  {
    id: "noRunIfEmpty",
    short: "-r",
    long: "--no-run-if-empty",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not run if input is empty",
    detail: "Do not run if input is empty",
    order: 20,
  },
  {
    id: "maxArgs",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Use at most N input items per command",
    detail: "Use at most N input items per command",
    order: 30,
    arg: {
      placeholder: "1",
      separator: " ",
    },
  },
  {
    id: "replace",
    short: "-I",
    long: "-I",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Replace a placeholder in the command",
    detail: "Replace a placeholder in the command",
    order: 40,
    arg: {
      placeholder: "{}",
      separator: " ",
    },
  },
  {
    id: "parallel",
    short: "-P",
    long: "-P",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Run up to N commands in parallel",
    detail: "Run up to N commands in parallel",
    order: 50,
    arg: {
      placeholder: "4",
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
