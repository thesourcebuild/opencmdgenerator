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
    id: "batchMode",
    short: "-b",
    long: "-b",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Run in batch mode.",
    detail: "Suppresses interactive-terminal control characters, useful for sending top's output to a file or another program.",
    order: 10,
  },
  {
    id: "iterations",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "1", separator: " " },
    summary: "Exit after this many updates.",
    detail: "Commonly paired with -b to take a single snapshot and exit, e.g. -b -n 1.",
    order: 20,
  },
  {
    id: "delay",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "5", separator: " " },
    summary: "Seconds between screen updates.",
    detail: "Accepts a fractional number of seconds, e.g. 0.5.",
    order: 30,
  },
  {
    id: "pid",
    short: "-p",
    long: "-p",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "1234", separator: " " },
    summary: "Monitor only this process ID.",
    detail: "May be repeated on the real command to watch several PIDs; here it accepts one comma-separated value, e.g. 1234,5678.",
    order: 40,
  },
  {
    id: "user",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "alice", separator: " " },
    summary: "Show only processes owned by this user.",
    detail: "Accepts a username or numeric UID.",
    order: 50,
  },
  {
    id: "threadMode",
    short: "-H",
    long: "-H",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show individual threads instead of a summary line per process.",
    detail: "GNU top only; on some systems this has no effect.",
    order: 60,
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
