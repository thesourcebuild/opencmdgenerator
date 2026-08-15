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
    id: "pretty",
    short: "-p",
    long: "--pretty",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["since"],
    summary: "Show uptime in a human-friendly phrase.",
    detail: 'e.g. "up 1 week, 2 days, 3 hours, 4 minutes" instead of the default one-line summary.',
    order: 10,
  },
  {
    id: "since",
    short: "-s",
    long: "--since",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["pretty"],
    summary: "Show the system boot time instead of the uptime.",
    detail: "Prints the date and time the system came up, in yyyy-mm-dd HH:MM:SS format.",
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
