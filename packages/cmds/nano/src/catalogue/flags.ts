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
    id: "lineNumbers",
    short: "-l",
    long: "--linenumbers",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show line numbers in the left margin.",
    detail: "Useful when editing code or logs you'll need to reference by line.",
    order: 10,
  },
  {
    id: "noWrap",
    short: "-w",
    long: "--nowrap",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Don't wrap long lines at the edge of the screen.",
    detail: "Useful for wide tabular output or code that wrapping would otherwise scramble.",
    order: 20,
  },
  {
    id: "backup",
    short: "-B",
    long: "--backup",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Save a backup of the original file before overwriting it.",
    detail: "The safer choice — the backup is written alongside the original with a ~ suffix, so an accidental save can still be undone.",
    order: 30,
  },
  {
    id: "mouse",
    short: "-m",
    long: "--mouse",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Enable mouse support for cursor placement and menu selection.",
    detail: "Requires a terminal that reports mouse events; has no effect in one that doesn't.",
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
