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
    id: "noConfirm",
    long: "--noconfirm",
    group: "options",
    kind: "boolean",
    summary: "Skip all confirmation prompts.",
    detail:
      "Needed for non-interactive/scripted use; without it pacman pauses to confirm before installing, removing, or upgrading.",
    order: 10,
  },
  {
    id: "needed",
    long: "--needed",
    group: "options",
    kind: "boolean",
    summary: "Skip reinstalling packages that are already up to date.",
    detail:
      "Only meaningful with the sync operation — without it, pacman -S always reinstalls even an already-current package.",
    order: 20,
  },
  {
    id: "cascade",
    long: "--cascade",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Also remove every package that depends on the package(s) being removed.",
    detail:
      "Only meaningful with the remove operation — can remove far more than intended if other software depends on the target package.",
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
