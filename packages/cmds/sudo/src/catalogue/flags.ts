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
    id: "asUser",
    short: "-u",
    long: "-u",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "www-data", separator: " " },
    summary: "Run the command as this user instead of root.",
    detail: "Without this, the command runs as root (uid 0).",
    order: 10,
  },
  {
    id: "interactiveShell",
    short: "-i",
    long: "-i",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Start an interactive login shell as the target user.",
    detail: "Simulates a full login (reads the target user's shell startup files); ignores any trailing command.",
    order: 20,
  },
  {
    id: "shell",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Run the target user's shell instead of a specific command.",
    detail: "Similar to -i but doesn't simulate a full login — doesn't read login-specific startup files.",
    order: 30,
  },
  {
    id: "validate",
    short: "-v",
    long: "-v",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Extend sudo's cached-credential timeout without running a command.",
    detail: "Prompts for a password if the cache has expired, then exits without doing anything else.",
    order: 40,
  },
  {
    id: "invalidate",
    short: "-k",
    long: "-k",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Invalidate sudo's cached credentials.",
    detail: "Forces the next sudo invocation to prompt for a password again, even if within the normal cache window.",
    order: 50,
  },
  {
    id: "listCommands",
    short: "-l",
    long: "-l",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "List the commands this user is allowed to run with sudo.",
    detail: "Reads the effective sudoers configuration for the current user.",
    order: 60,
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
