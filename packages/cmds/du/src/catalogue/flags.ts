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
    id: "humanReadable",
    short: "-h",
    long: "--human-readable",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print sizes in a human-readable form (K, M, G).",
    detail: "Uses power-of-1024 units.",
    order: 10,
  },
  {
    id: "summarize",
    short: "-s",
    long: "--summarize",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["maxDepth"],
    summary: "Show only a total for each argument, not every subdirectory.",
    detail: "Equivalent to --max-depth=0 — combining it with an explicit --max-depth is redundant at best and contradictory at worst.",
    order: 20,
  },
  {
    id: "all",
    short: "-a",
    long: "--all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show sizes for all files, not just directories.",
    detail: "Without this, du only reports directory totals, not individual file sizes.",
    order: 30,
  },
  {
    id: "maxDepth",
    long: "--max-depth",
    group: "options",
    kind: "number",
    conflictsWith: ["summarize"],
    arg: { placeholder: "1", separator: "=", min: 0 },
    summary: "Only show totals down to this many directory levels deep.",
    detail: "--max-depth=0 is the same as --summarize — contradictory when combined with an explicit --summarize.",
    order: 40,
  },
  {
    id: "total",
    short: "-c",
    long: "--total",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print a grand total at the end.",
    detail: "Sums usage across every listed argument.",
    order: 50,
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
