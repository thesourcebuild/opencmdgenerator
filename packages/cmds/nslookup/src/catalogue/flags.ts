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

/**
 * Real nslookup has always accepted `-type=X` and its older synonym
 * `-query=X` as two independent spellings of the exact same option — never
 * meant to be combined. Modeled as two separate catalogue flags (rather than
 * one with a "which spelling" toggle) so each renders as its own attached
 * `-type=...`/`-query=...` token via the generic text-flag renderer, and
 * `conflictsWith` catches setting both at once the same way traceroute's -4/-6 do.
 */
export const FLAGS: readonly FlagDef[] = [
  {
    id: "queryType",
    long: "-type",
    group: "query",
    kind: "text",
    arg: { placeholder: "MX", separator: "=" },
    conflictsWith: ["queryClass"],
    summary: "Record type to query, e.g. MX, TXT, NS.",
    detail: "The modern spelling of this option; -query= below is the older synonym for the exact same thing.",
    order: 10,
  },
  {
    id: "queryClass",
    long: "-query",
    group: "query",
    kind: "text",
    arg: { placeholder: "MX", separator: "=" },
    conflictsWith: ["queryType"],
    summary: "Older synonym for -type= — same record-type query, different spelling.",
    detail: "Kept for compatibility with older nslookup scripts; -type= above is the more commonly seen form today.",
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
