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
    id: "system",
    long: "--system",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Create a system account instead of a normal user account.",
    detail:
      "System accounts get no home directory and no login shell by default, and take a UID from the system range instead of the normal range. Add --home and --shell explicitly if this account still needs to log in.",
    order: 10,
  },
  {
    id: "disabledLogin",
    long: "--disabled-login",
    group: "options",
    kind: "boolean",
    conflictsWith: ["disabledPassword"],
    summary: "Lock the account's password so no password login is possible.",
    detail:
      "Common for accounts meant to be reached only via su, sudo, or SSH keys — e.g. deployment or service accounts. Distinct from --disabled-password in the shadow file field it sets.",
    order: 20,
  },
  {
    id: "disabledPassword",
    long: "--disabled-password",
    group: "options",
    kind: "boolean",
    conflictsWith: ["disabledLogin"],
    summary: "Leave the account without a usable password, but do not otherwise lock it.",
    detail:
      "Similar in effect to --disabled-login but a different shadow-file field — keeps the account usable via key-based SSH login even though no password will ever work.",
    order: 30,
  },
  {
    id: "shell",
    long: "--shell",
    group: "options",
    kind: "text",
    arg: { placeholder: "/bin/bash", separator: " " },
    summary: "Set the account's login shell.",
    detail: "Without this, adduser uses the distribution's configured default shell (usually /bin/bash).",
    order: 40,
  },
  {
    id: "home",
    long: "--home",
    group: "options",
    kind: "text",
    arg: { placeholder: "/home/alice", separator: " " },
    summary: "Use this path as the home directory instead of the default.",
    detail: "Without this, adduser derives the home directory from the username under the system's default base (usually /home).",
    order: 50,
  },
  {
    id: "ingroup",
    long: "--ingroup",
    group: "options",
    kind: "text",
    arg: { placeholder: "developers", separator: " " },
    summary: "Use this existing group as the account's primary group.",
    detail:
      "Without this, adduser creates a new group matching the username and uses it as the primary group — Debian's default 'user private group' scheme.",
    order: 60,
  },
  {
    id: "gecos",
    long: "--gecos",
    group: "options",
    kind: "text",
    arg: { placeholder: "Alice Smith,,,", separator: " " },
    summary: "Set the account's GECOS field (full name and related info) without prompting.",
    detail:
      "Without this, adduser normally prompts interactively for full name, room number, and phone numbers; this flag supplies that information up front and skips the prompts.",
    order: 70,
  },
  {
    id: "uid",
    long: "--uid",
    group: "options",
    kind: "text",
    arg: { placeholder: "1500", separator: " " },
    summary: "Use this specific numeric user ID instead of the next available one.",
    detail: "Must be unique, the same as useradd's -u.",
    order: 80,
  },
  {
    id: "forceBadname",
    long: "--force-badname",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Skip adduser's username-validity check.",
    detail:
      "Allows a username that doesn't match the system's normal naming convention (e.g. uppercase letters or unusual characters), which can confuse other tools that assume standard POSIX usernames.",
    order: 90,
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
