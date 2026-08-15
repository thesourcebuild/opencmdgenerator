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
      "Needed for non-interactive/scripted use; without it yum pauses to confirm before installing, removing, or updating.",
    order: 10,
  },
  {
    id: "enableRepo",
    long: "--enablerepo",
    group: "options",
    kind: "text",
    arg: { placeholder: "epel", separator: "=" },
    summary: "Enable a normally-disabled repository just for this run.",
    detail:
      "Useful for pulling a package from an optional repo without permanently enabling it in the system config.",
    order: 20,
  },
  {
    id: "disableRepo",
    long: "--disablerepo",
    group: "options",
    kind: "text",
    arg: { placeholder: "updates", separator: "=" },
    summary: "Disable a repository just for this run.",
    detail: "Useful for excluding a repo that's currently causing problems without permanently disabling it.",
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
