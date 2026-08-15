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
    id: "ignoreCase",
    short: "-i",
    long: "--ignore-case",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Match regardless of case.",
    detail: "\"Report\" matches \"report\", \"Report\", and every other capitalization.",
    order: 10,
  },
  {
    id: "count",
    short: "-c",
    long: "--count",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print only the number of matches, not the matching paths themselves.",
    detail: "One total number, instead of one path per line.",
    order: 20,
  },
  {
    id: "regexp",
    short: "-r",
    long: "--regexp",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Treat the pattern as a regular expression instead of a shell glob.",
    detail: "Without this, the pattern matches the way a shell glob does (* and ? as wildcards). With it, the same field is read as a full regular expression.",
    order: 30,
  },
  {
    id: "all",
    short: "-A",
    long: "--all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Require every given pattern to match, instead of any one of them.",
    detail: "Only matters when more than one pattern is given — this app's single pattern field means it has no visible effect here, but it's real locate syntax.",
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
