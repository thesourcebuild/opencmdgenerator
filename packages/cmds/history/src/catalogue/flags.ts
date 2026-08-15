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
    id: "deleteOffset",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "number",
    preferShort: true,
    arg: { placeholder: "offset", separator: " " },
    conflictsWith: ["clear"],
    summary: "Delete the single history entry at this offset.",
    detail: "Removes just one entry from the list, identified by its position number as shown by a bare history.",
    order: 10,
  },
  {
    id: "clear",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["deleteOffset"],
    danger: "caution",
    summary: "Clear the entire history list for the current session.",
    detail: "Removes every entry at once — irreversible for the in-memory list, though the on-disk history file is untouched until this session's history is next saved.",
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
