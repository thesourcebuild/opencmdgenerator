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
  // ── which timestamp ──────────────────────────────────────────────────────
  {
    id: "accessOnly",
    short: "-a",
    long: "-a",
    group: "which-time",
    kind: "boolean",
    preferShort: true,
    // Deliberately no conflictsWith: real touch -am together is valid (means
    // "update both", the same as neither flag) — not a contradiction.
    summary: "Change only the access time.",
    detail: "Leaves the modification time untouched. Combine with none of the others to also update both (the default).",
    order: 10,
  },
  {
    id: "modifyOnly",
    short: "-m",
    long: "-m",
    group: "which-time",
    kind: "boolean",
    preferShort: true,
    summary: "Change only the modification time.",
    detail: "Leaves the access time untouched.",
    order: 20,
  },

  // ── time source ───────────────────────────────────────────────────────────
  {
    id: "date",
    short: "-d",
    long: "--date",
    group: "time-source",
    kind: "text",
    conflictsWith: ["reference"],
    arg: { placeholder: "2 hours ago", separator: " " },
    summary: "Parse a free-form date/time string instead of using now.",
    detail: "Accepts almost anything a human would write: \"2 hours ago\", \"next Thursday\", \"2026-01-01 12:00\".",
    order: 10,
  },
  {
    id: "stamp",
    short: "-t",
    long: "-t",
    group: "time-source",
    kind: "text",
    preferShort: true,
    conflictsWith: ["reference"],
    arg: { placeholder: "[[CC]YY]MMDDhhmm[.ss]", separator: " " },
    summary: "Use this exact timestamp instead of now.",
    detail: "A fixed-width numeric stamp: [[CC]YY]MMDDhhmm[.ss] — e.g. 202601011200 for 2026-01-01 12:00.",
    order: 20,
  },
  {
    id: "reference",
    short: "-r",
    long: "--reference",
    group: "time-source",
    kind: "path",
    conflictsWith: ["date", "stamp"],
    arg: { placeholder: "ref_file.txt", separator: "=" },
    summary: "Copy the timestamp from another file instead of using now.",
    detail: "Mutually exclusive with --date and -t — touch accepts a time source or none, never two at once.",
    order: 30,
  },

  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "noCreate",
    short: "-c",
    long: "--no-create",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not create any files that don't already exist.",
    detail: "Without this, touch silently creates an empty file for any target that doesn't exist yet.",
    order: 10,
  },
  {
    id: "noDereference",
    short: "-h",
    long: "--no-dereference",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Affect a symlink itself, not the file it points to.",
    detail: "Only has an effect on systems that can change a symlink's own timestamps.",
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
