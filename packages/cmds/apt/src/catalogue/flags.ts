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
    id: "assumeYes",
    short: "-y",
    long: "-y",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Automatically answer yes to all prompts.",
    detail:
      "Needed for non-interactive/scripted use; without it apt pauses to confirm before installing or removing.",
    order: 10,
  },
  {
    id: "purge",
    long: "--purge",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Also remove configuration files when removing a package.",
    detail:
      "Only meaningful with the remove action — normally apt leaves config files behind so a future reinstall preserves settings.",
    order: 20,
  },
  {
    id: "simulate",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show what would happen without actually doing it.",
    detail: "A dry run — no packages are actually installed, removed, or upgraded.",
    order: 30,
  },
  {
    id: "fixBroken",
    long: "--fix-broken",
    group: "options",
    kind: "boolean",
    summary: "Attempt to fix a system with broken dependencies.",
    detail:
      "Useful after an interrupted or failed install/remove left the package database in an inconsistent state.",
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
