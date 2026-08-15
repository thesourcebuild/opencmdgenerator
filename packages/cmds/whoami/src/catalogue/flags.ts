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
 * `availableOn` here is the collapsed 2-value tag from `pure.ts`'s
 * `windowsFlagTag` ("posix" | "windows"), NOT `WhoamiSpec["platform"]`
 * directly — windows-cmd and windows-powershell share the exact same flag
 * set, since both just invoke the one real whoami.exe.
 */
export const FLAGS: readonly FlagDef[] = [
  // ── Windows (whoami.exe) — POSIX coreutils whoami has no flags at all
  // beyond --help/--version, always excluded. ──────────────────────────────
  {
    id: "allInfo",
    long: "/ALL",
    group: "options",
    kind: "boolean",
    availableOn: ["windows"],
    conflictsWith: ["groups", "privileges"],
    summary: "Show user, group membership, and privilege information together.",
    detail: "Cannot be combined with /GROUPS or /PRIV individually — /ALL already includes both.",
    order: 10,
  },
  {
    id: "groups",
    long: "/GROUPS",
    group: "options",
    kind: "boolean",
    availableOn: ["windows"],
    conflictsWith: ["allInfo"],
    summary: "Show the current user's group membership.",
    detail: "Lists every group the current user belongs to, with security identifiers.",
    order: 20,
  },
  {
    id: "privileges",
    long: "/PRIV",
    group: "options",
    kind: "boolean",
    availableOn: ["windows"],
    conflictsWith: ["allInfo"],
    summary: "Show the current user's security privileges.",
    detail: "Lists Windows security privileges (like SeShutdownPrivilege) and whether each is enabled.",
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
