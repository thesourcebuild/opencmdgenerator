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
    id: "force",
    short: "-f",
    long: "--force",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Force an immediate power-off, without going through systemd/logind.",
    detail:
      "Skips asking the service manager to shut things down in order — sessions and services don't get a graceful chance to stop first.",
    order: 10,
  },
  {
    id: "noSync",
    short: "-n",
    long: "--no-sync",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Skip syncing filesystem buffers to disk before powering off.",
    detail: "Any data still buffered in memory and not yet written to disk is lost.",
    order: 20,
  },
  {
    id: "wtmpOnly",
    short: "-w",
    long: "--wtmp-only",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "none",
    summary: "Only write a wtmp shutdown record — don't actually power off the machine.",
    detail:
      "Logs the event as if a power-off happened, for accounting/audit purposes, but the machine keeps running. Safe to use for testing.",
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
