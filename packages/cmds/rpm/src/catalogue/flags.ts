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
    id: "verbose",
    short: "-v",
    long: "-v",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print verbose output.",
    detail: "Shows additional detail about what rpm is doing.",
    order: 10,
  },
  {
    id: "hash",
    short: "-h",
    long: "-h",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print hash marks (#) as a progress indicator during install.",
    detail: "Only meaningful during install — gives simple visual feedback for a long-running operation.",
    order: 20,
  },
  {
    id: "force",
    long: "--force",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Install even if it means replacing a newer package with an older one, or overwriting files from another package.",
    detail: "This flag can silently downgrade packages or break file ownership if misused.",
    order: 30,
  },
  {
    id: "noDeps",
    long: "--nodeps",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Skip dependency checks entirely.",
    detail: "Can leave the system with broken dependencies if the package genuinely needed something that isn't installed.",
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
