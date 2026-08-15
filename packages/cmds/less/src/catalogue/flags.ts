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
    id: "lineNumbers",
    short: "-N",
    long: "--LINE-NUMBERS",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show a line number to the left of each line.",
    detail: "Useful when reading code or logs you'll need to reference by line.",
    order: 10,
  },
  {
    id: "chopLongLines",
    short: "-S",
    long: "--chop-long-lines",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Don't wrap long lines — scroll sideways instead.",
    detail: "Useful for wide tabular output that wrapping would otherwise scramble.",
    order: 20,
  },
  {
    id: "ignoreCase",
    short: "-i",
    long: "--ignore-case",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["ignoreCaseAlways"],
    summary: "Searches ignore case, unless the search pattern contains an uppercase letter.",
    detail: "Typing an uppercase letter anywhere in the search pattern switches that search back to case-sensitive.",
    order: 30,
  },
  {
    id: "ignoreCaseAlways",
    short: "-I",
    long: "--IGNORE-CASE",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["ignoreCase"],
    summary: "Searches always ignore case, even if the pattern has uppercase letters.",
    detail: "Unlike -i, uppercase letters in the pattern never switch this back to case-sensitive.",
    order: 40,
  },
  {
    id: "longPrompt",
    short: "-M",
    long: "--LONG-PROMPT",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show a more verbose prompt — current position, percentage through the file, and more.",
    detail: "Replaces the terse default prompt (just a colon) with one showing the filename, line range, and percentage read.",
    order: 50,
  },
  {
    id: "quitIfOneScreen",
    short: "-F",
    long: "--quit-if-one-screen",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Exit immediately if the whole file fits on one screen.",
    detail: "Makes less behave like cat for short files, while still paging longer ones.",
    order: 60,
  },
  {
    id: "noInit",
    short: "-X",
    long: "--no-init",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Don't clear the screen on exit.",
    detail: "Leaves the last page visible in the scrollback instead of restoring whatever was on screen before less started.",
    order: 70,
  },
  {
    id: "rawControlChars",
    short: "-R",
    long: "--RAW-CONTROL-CHARS",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Display ANSI color escape codes as colors instead of literal control characters.",
    detail: "The usual fix when piping colorized output (grep --color, ls --color, ...) into less and seeing garbage instead of colors.",
    order: 80,
  },
  {
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Force opening of files that aren't regular files (directories, binaries, device files).",
    detail: "less normally refuses these as a safety check — this overrides it.",
    order: 90,
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
