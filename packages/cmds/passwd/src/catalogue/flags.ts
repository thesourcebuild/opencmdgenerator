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
    id: "lock",
    short: "-l",
    long: "-l",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["unlock"],
    danger: "caution",
    summary: "Lock the account by disabling its password.",
    detail: "The account can't log in with a password until unlocked again.",
    order: 10,
  },
  {
    id: "unlock",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["lock"],
    summary: "Unlock a previously locked account.",
    detail: "Mutually exclusive with -l — pick one direction, not both.",
    order: 20,
  },
  {
    id: "deletePassword",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Delete the account's password entirely, leaving it passwordless.",
    detail: "A significant security risk on any account that can log in interactively.",
    order: 30,
  },
  {
    id: "expire",
    short: "-e",
    long: "-e",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Force the password to expire immediately.",
    detail: "The user will be required to set a new password the next time they log in.",
    order: 40,
  },
  {
    id: "status",
    short: "-S",
    long: "-S",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show the account's password status instead of changing anything.",
    detail:
      "Reports whether the account has a password, is locked, and other password-aging details, without prompting for a new password.",
    order: 50,
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
