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
    id: "humanReadable",
    short: "-h",
    long: "--human-readable",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["siUnits"],
    summary: "Print sizes in a human-readable form (K, M, G).",
    detail: "Uses power-of-1024 units; see -H for power-of-1000 units instead.",
    order: 10,
  },
  {
    id: "siUnits",
    short: "-H",
    long: "--si",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["humanReadable"],
    summary: "Print sizes using power-of-1000 (SI) units instead of power-of-1024.",
    detail: "Mutually exclusive with -h — pick one human-readable unit convention, not both.",
    order: 20,
  },
  {
    id: "showType",
    short: "-T",
    long: "--print-type",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show each filesystem's type (ext4, nfs, tmpfs, etc.).",
    detail: "Adds a Type column to the output; GNU df only.",
    order: 30,
  },
  {
    id: "inodes",
    short: "-i",
    long: "--inodes",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Report inode usage instead of block usage.",
    detail: "Useful when a filesystem runs out of inodes even though space remains.",
    order: 40,
  },
  {
    id: "allFilesystems",
    short: "-a",
    long: "--all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Include pseudo, duplicate, and inaccessible filesystems.",
    detail: "Without this, df hides filesystems with zero size (like many virtual/pseudo filesystems).",
    order: 50,
  },
  {
    id: "total",
    long: "--total",
    group: "options",
    kind: "boolean",
    summary: "Print a grand total line at the end.",
    detail: "GNU df only; sums usage across all listed filesystems.",
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
