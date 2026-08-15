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
  // ── selection ────────────────────────────────────────────────────────────
  {
    id: "everyone",
    short: "-e",
    long: "-e",
    group: "selection",
    kind: "boolean",
    preferShort: true,
    summary: "Select every process on the system.",
    detail:
      "Equivalent to selecting all processes; without it, ps by default shows only processes owned by the current user attached to the current terminal.",
    order: 10,
  },
  {
    id: "allWithTty",
    short: "-a",
    long: "-a",
    group: "selection",
    kind: "boolean",
    preferShort: true,
    summary: "Select all processes except session leaders and processes not associated with a terminal.",
    detail: "Commonly combined with -x to also include processes without a controlling terminal.",
    order: 20,
  },
  {
    id: "withoutTty",
    short: "-x",
    long: "-x",
    group: "selection",
    kind: "boolean",
    preferShort: true,
    summary: "Include processes without a controlling terminal.",
    detail: "Needed alongside -a to see background daemons in a BSD-style listing.",
    order: 30,
  },
  {
    id: "pid",
    short: "-p",
    long: "--pid",
    group: "selection",
    kind: "text",
    arg: { placeholder: "1234", separator: " " },
    summary: "Select by process ID.",
    detail: "Accepts a single PID or a comma-separated list, e.g. 1234,5678.",
    order: 40,
  },

  // ── format ───────────────────────────────────────────────────────────────
  {
    id: "fullFormat",
    short: "-f",
    long: "-f",
    group: "format",
    kind: "boolean",
    preferShort: true,
    summary: "Full-format listing.",
    detail: "Adds UID, PPID, start time, and the full command line to the output.",
    order: 10,
  },
  {
    id: "userFormat",
    short: "-u",
    long: "-u",
    group: "format",
    kind: "boolean",
    preferShort: true,
    summary: "User-oriented format.",
    detail:
      'Shows %CPU, %MEM, and start time in a human-friendly layout — the format half of the classic "ps aux".',
    order: 20,
  },
  {
    id: "sortBy",
    long: "--sort",
    group: "format",
    kind: "text",
    arg: { placeholder: "-%cpu", separator: "=" },
    summary: "Sort the output by one or more comma-separated keys.",
    detail: "Prefix a key with - for descending order, e.g. --sort=-%cpu to show the busiest processes first.",
    order: 30,
  },
  {
    id: "format",
    short: "-o",
    long: "-o",
    group: "format",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "pid,comm,%cpu", separator: " " },
    summary: "Print exactly these user-defined columns.",
    detail: "Comma-separated list of format keywords, e.g. pid,comm,%cpu,%mem.",
    order: 40,
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
