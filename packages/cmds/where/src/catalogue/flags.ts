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

// Real where.exe flags use a slash, not a dash (/R, /Q, /F, /T) — the engine
// renders `short`/`long` verbatim, with no assumption about the prefix
// character, so this "just works" the same way dash-prefixed flags do
// everywhere else in this app.
export const FLAGS: readonly FlagDef[] = [
  {
    id: "recursive",
    short: "/R",
    long: "/R",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "C:\\", separator: " " },
    summary: "Recursively search this directory and all its subdirectories.",
    detail: "Without this, where only searches the current directory and the paths listed in PATH.",
    order: 10,
  },
  {
    id: "quiet",
    short: "/Q",
    long: "/Q",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress all output; only set the exit code.",
    detail: "Exit code is 0 if every pattern matched, 1 if none did, 2 on a bad argument. Nothing is printed either way.",
    order: 20,
  },
  {
    id: "quotedFilenames",
    short: "/F",
    long: "/F",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Enclose each matched filename in double quotes.",
    detail: "Useful when a match's path contains spaces and the output feeds into another command.",
    order: 30,
  },
  {
    id: "showDetails",
    short: "/T",
    long: "/T",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show file size and last-modified date/time for each match.",
    detail: "Adds these two columns to each line of output, after the matched path.",
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
