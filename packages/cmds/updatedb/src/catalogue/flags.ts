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
    id: "localpaths",
    short: "-f",
    long: "--localpaths",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "/home /srv", separator: "=" },
    summary: "Restrict the scan to these paths instead of the configured defaults.",
    detail:
      "Real updatedb takes a single space-separated list of directories as one argument — e.g. --localpaths='/home /srv' — not a repeatable flag, so this app models it as one free-form text field rather than an array.",
    order: 10,
  },
  {
    id: "prunepaths",
    short: "-U",
    long: "--prunepaths",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "/tmp /var/tmp", separator: "=" },
    summary: "Skip these paths entirely while scanning.",
    detail: "Same space-separated-list-as-one-argument shape as --localpaths, but for directories to exclude from the database.",
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
