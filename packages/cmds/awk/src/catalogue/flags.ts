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
  // `long` is set to the short spelling itself (same trick as @cmdgen/grep's
  // -C and @cmdgen/sort's -t) so the generic text-flag renderer, which always
  // emits `def.long`, produces the short form real-world usage actually reads.
  {
    id: "fieldSeparator",
    short: "-F",
    long: "-F",
    group: "options",
    kind: "text",
    arg: { placeholder: ":", separator: " " },
    summary: "Set the input field separator.",
    detail: "Splits each input line into $1, $2, ... on this character (or regex, in GNU awk) instead of whitespace.",
    order: 10,
  },
  {
    id: "posixMode",
    long: "--posix",
    group: "options",
    kind: "boolean",
    summary: "Disable GNU awk extensions, matching POSIX awk behavior.",
    detail: "Useful when writing a script meant to run on any awk, not just gawk.",
    order: 20,
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
