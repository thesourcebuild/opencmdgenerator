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
    id: "bestCompression",
    short: "-9",
    long: "-9",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["noCompression"],
    summary: "Use maximum compression (slowest, smallest).",
    detail:
      "Compression levels run from -0 (store only, fastest) to -9 (maximum, slowest); this app only exposes the two extremes.",
    order: 10,
  },
  {
    id: "noCompression",
    short: "-0",
    long: "-0",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["bestCompression"],
    summary: "Store files with no compression (fastest).",
    detail: "Mutually exclusive with -9 — pick one compression extreme, not both.",
    order: 20,
  },
  {
    id: "recursive",
    short: "-r",
    long: "-r",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Recurse into directories.",
    detail: "Needed to add a directory's contents, not just the directory entry itself.",
    order: 30,
  },
  {
    id: "quiet",
    short: "-q",
    long: "-q",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress most output.",
    detail: "Only errors are still printed.",
    order: 40,
  },
  {
    id: "verbose",
    short: "-v",
    long: "-v",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print detailed progress for each file added.",
    detail: "Useful for confirming exactly what got included.",
    order: 50,
  },
  {
    id: "exclude",
    short: "-x",
    long: "-x",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "*.log", separator: " " },
    summary: "Exclude files matching this pattern.",
    detail: "Accepts a shell glob pattern; matching files are skipped even if they'd otherwise be included.",
    order: 60,
  },
  {
    id: "encrypt",
    short: "-e",
    long: "-e",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Encrypt archive entries with a password (prompted interactively).",
    detail:
      "Uses zip's traditional (weak) encryption — not suitable for protecting sensitive data, only casual access control.",
    order: 70,
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
