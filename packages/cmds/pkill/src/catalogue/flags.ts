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
    id: "full",
    short: "-f",
    long: "--full",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Match against the full command line, not just the process name.",
    detail: "Without this, pkill only matches the process name (as it would appear in ps -o comm=), truncated the same way ps truncates it.",
    order: 10,
  },
  {
    id: "signal",
    long: "--signal",
    group: "options",
    kind: "text",
    arg: { placeholder: "TERM", separator: " " },
    danger: "caution",
    summary: "Send this signal instead of the default SIGTERM.",
    detail:
      "Accepts a signal name without the SIG prefix (e.g. KILL, HUP) or a number (e.g. 9). Real pkill also accepts a bare -SIGNAL/-9 shorthand; only the --signal spelling is modeled here.",
    order: 20,
  },
  {
    id: "user",
    short: "-u",
    long: "--user",
    group: "options",
    kind: "text",
    arg: { placeholder: "alice", separator: " " },
    summary: "Only match processes owned by this user.",
    detail: "Accepts a username or numeric UID (pkill's real --uid/-u effective-ID filter).",
    order: 30,
  },
  {
    id: "exact",
    short: "-x",
    long: "--exact",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Require an exact match of the whole name (or full command line, with --full).",
    detail: "Without this, the pattern only needs to match a substring — see the caution note this app shows below.",
    order: 40,
  },
  {
    id: "oldest",
    short: "-o",
    long: "--oldest",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["newest"],
    summary: "Only signal the single oldest (least recently started) matching process.",
    detail: "Mutually exclusive with --newest — picking both makes no sense, since they select opposite ends of the match list.",
    order: 50,
  },
  {
    id: "newest",
    short: "-n",
    long: "--newest",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["oldest"],
    summary: "Only signal the single newest (most recently started) matching process.",
    detail: "Mutually exclusive with --oldest.",
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
