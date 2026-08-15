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
    id: "createHome",
    short: "-m",
    long: "-m",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Create the user's home directory if it doesn't already exist.",
    detail:
      "Without this, some distributions don't create a home directory at all, leaving the new account without one.",
    order: 10,
  },
  {
    id: "homeDir",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "/home/alice", separator: " " },
    summary: "Use this path as the home directory instead of the default.",
    detail:
      "Without this, useradd derives the home directory from the username under the system's default base (usually /home).",
    order: 20,
  },
  {
    id: "shell",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "/bin/bash", separator: " " },
    summary: "Set the account's login shell.",
    detail: "Without this, the system default shell is used (often /bin/sh).",
    order: 30,
  },
  {
    id: "primaryGroup",
    short: "-g",
    long: "-g",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "developers", separator: " " },
    summary: "Set the account's primary group by name or GID.",
    detail: "Without this, most distributions either create a matching private group or use a configured default.",
    order: 40,
  },
  {
    id: "secondaryGroups",
    short: "-G",
    long: "-G",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "sudo,docker", separator: " " },
    summary: "Add the account to these additional groups (comma-separated).",
    detail: "Unlike the primary group, an account can belong to any number of secondary groups.",
    order: 50,
  },
  {
    id: "uid",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "1500", separator: " " },
    summary: "Use this specific numeric user ID instead of the next available one.",
    detail: "Must be unique unless combined with a flag allowing duplicates (not modeled here).",
    order: 60,
  },
  {
    id: "comment",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "Alice Smith", separator: " " },
    summary: "Set the account's comment/full-name field (GECOS).",
    detail: "Shown by tools like `finger` and often used to store a display name.",
    order: 70,
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
    detail: "Format is YYYY-MM-DD; leave unset for an account that never expires.",
    order: 80,
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
