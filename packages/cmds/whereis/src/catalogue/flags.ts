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
  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "binaryOnly",
    short: "-b",
    long: "-b",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["manualOnly", "sourceOnly"],
    summary: "Search for binaries only.",
    detail:
      "Mutually exclusive with -m and -s — whereis reports binary/manual/source paths and this narrows it to just one category.",
    order: 10,
  },
  {
    id: "manualOnly",
    short: "-m",
    long: "-m",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["binaryOnly", "sourceOnly"],
    summary: "Search for manual pages only.",
    detail: "Mutually exclusive with -b and -s.",
    order: 20,
  },
  {
    id: "sourceOnly",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["binaryOnly", "manualOnly"],
    summary: "Search for source files only.",
    detail: "Mutually exclusive with -b and -m.",
    order: 30,
  },
  {
    id: "unusual",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Report commands that have an unusual number of results.",
    detail:
      "By default finds commands missing one of binary/manual/source, or having more than one of a category — useful for spotting duplicates or gaps.",
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
