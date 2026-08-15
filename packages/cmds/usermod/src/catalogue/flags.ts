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

// Text-kind flags below set `long` to the SHORT flag string (not the real
// `--long-form`), the same modeling choice `@cmdgen/useradd` makes for `-u`:
// `buildFlagArgs` always renders a text-kind flag's `long` field regardless of
// `preferShort` (that switch only affects boolean/enum flags), so this is the
// only way to make the short form actually render.
export const FLAGS: readonly FlagDef[] = [
  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "login",
    short: "-l",
    long: "-l",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "alice2", separator: " " },
    summary: "Change the account's login name.",
    detail: "Only the name changes — home directory, UID, and group memberships are untouched unless also given here.",
    order: 10,
  },
  {
    id: "home",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "/home/alice", separator: " " },
    summary: "Change the account's home directory field.",
    detail: "Without -m, only the recorded path changes — the actual directory and its contents stay where they were.",
    order: 20,
  },
  {
    id: "moveHome",
    short: "-m",
    long: "-m",
    group: "options",
    kind: "boolean",
    preferShort: true,
    requires: ["home"],
    summary: "Move the contents of the old home directory to the new one.",
    detail: "Only valid together with -d. Creates the new directory if needed and moves the old directory's contents into it.",
    order: 30,
  },
  {
    id: "gid",
    short: "-g",
    long: "-g",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "developers", separator: " " },
    summary: "Change the account's primary group.",
    detail: "Takes a group name or GID. Only the primary group changes — supplementary groups are set separately with -G.",
    order: 40,
  },
  {
    id: "groups",
    short: "-G",
    long: "-G",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "sudo,docker", separator: " " },
    danger: "caution",
    summary: "Set the account's supplementary group list (comma-separated).",
    detail: "Without -a, this REPLACES the account's entire supplementary group list — any existing membership not repeated here is silently dropped.",
    order: 50,
  },
  {
    id: "append",
    short: "-a",
    long: "-a",
    group: "options",
    kind: "boolean",
    preferShort: true,
    requires: ["groups"],
    summary: "Add to the groups given in -G instead of replacing the whole list.",
    detail: "Only meaningful together with -G. Without it, -G silently replaces every existing supplementary group membership.",
    order: 60,
  },
  {
    id: "shell",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "/bin/bash", separator: " " },
    summary: "Change the account's login shell.",
    detail: "Takes effect on the next login.",
    order: 70,
  },
  {
    id: "lock",
    short: "-L",
    long: "-L",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    conflictsWith: ["unlock"],
    summary: "Lock the account by disabling its password.",
    detail: "Prepends a '!' to the encrypted password in /etc/shadow. Does not disable key-based SSH login or other authentication methods.",
    order: 80,
  },
  {
    id: "unlock",
    short: "-U",
    long: "-U",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    conflictsWith: ["lock"],
    summary: "Unlock the account by re-enabling its password.",
    detail: "Removes the '!' prefix added by -L. Has no effect if the account wasn't locked with -L in the first place.",
    order: 90,
  },
  {
    id: "expireDate",
    short: "-e",
    long: "-e",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "2027-01-01", separator: " " },
    summary: "Set the date the account expires and is automatically disabled.",
    detail: "Format is YYYY-MM-DD. An empty value would clear the expiry, but that's not modeled as a distinct action here.",
    order: 100,
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
