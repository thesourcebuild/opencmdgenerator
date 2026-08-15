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
    id: "all",
    short: "-a",
    long: "-a",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Display all matching manual pages, not just the first.",
    detail: "Without this, man stops after showing the first match it finds across the configured manual sections.",
    order: 10,
  },
  {
    id: "whereis",
    short: "-w",
    long: "-w",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the location of the manual page file instead of displaying it.",
    detail: "Useful for scripting or checking which section a page actually lives in.",
    order: 20,
  },
  {
    id: "keyword",
    short: "-k",
    long: "-k",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Search the short descriptions and page names for a keyword (like apropos).",
    detail: "Treats the page argument as a keyword/regular expression to search for, not an exact page name.",
    order: 30,
  },
  {
    id: "short",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Display a one-line description instead of the full page (like whatis).",
    detail: "Equivalent to running whatis on the given name.",
    order: 40,
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
