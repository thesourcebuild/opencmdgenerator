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
    id: "quiet",
    short: "-n",
    long: "--quiet",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress automatic printing of the pattern space.",
    detail: "Only lines explicitly printed (e.g. via a p command in the script) are output — the usual pairing is -n with a script ending in p.",
    order: 10,
  },
  /**
   * BSD/macOS portability note (comment only — no platform axis modeled
   * here, same scope decision as the rest of this package): GNU sed's -r and
   * --extended-regexp are equivalent; BSD/macOS sed only understands -E for
   * the same thing and rejects -r outright. This catalogue models GNU sed's
   * spelling since that's what ships on Linux, this package's one modeled
   * platform.
   */
  {
    id: "extendedRegexp",
    short: "-r",
    long: "--regexp-extended",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Use extended regular expressions (ERE) instead of basic (BRE).",
    detail: "Lets the script use +, ?, |, and () without backslash-escaping them.",
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
