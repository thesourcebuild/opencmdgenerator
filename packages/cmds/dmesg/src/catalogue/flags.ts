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
    id: "human",
    short: "-H",
    long: "--human",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use human-readable output",
    detail: "Use human-readable output",
    order: 10,
  },
  {
    id: "ctime",
    short: "-T",
    long: "--ctime",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print human-readable timestamps",
    detail: "Print human-readable timestamps",
    order: 20,
  },
  {
    id: "follow",
    short: "-w",
    long: "--follow",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Wait for new messages",
    detail: "Wait for new messages",
    order: 30,
  },
  {
    id: "kernel",
    short: "-k",
    long: "--kernel",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print kernel messages only",
    detail: "Print kernel messages only",
    order: 40,
  },
  {
    id: "level",
    short: "-l",
    long: "-l",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Restrict output by log level",
    detail: "Restrict output by log level",
    order: 50,
    arg: {
      placeholder: "err,warn",
      separator: " ",
    },
  },
  {
    id: "clear",
    short: "-C",
    long: "--clear",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Clear the kernel ring buffer",
    detail: "Clear the kernel ring buffer",
    order: 60,
    danger: "destructive",
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
