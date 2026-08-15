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
    id: "active",
    short: "-a",
    long: "--active",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show active and inactive memory instead of the default memory columns.",
    detail: "Requires a 2.5.41 or newer kernel to report anything meaningful.",
    order: 10,
  },
  {
    id: "disk",
    short: "-d",
    long: "--disk",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["stats"],
    summary: "Report disk statistics instead of the default report.",
    detail: "A completely different table (reads, writes, I/O time per disk) from vmstat's normal memory/CPU columns.",
    order: 20,
  },
  {
    id: "stats",
    short: "-s",
    long: "--stats",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["disk"],
    summary: "Print a vertical table of event counters and memory statistics instead of the default report.",
    detail: "Also a completely different table from the default report — one line per counter, not one row per sample.",
    order: 30,
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
