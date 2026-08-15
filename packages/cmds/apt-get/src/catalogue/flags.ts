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
    long: "--yes",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Automatically answer yes to all prompts.",
    detail: "Needed for non-interactive/scripted use; without it apt-get pauses to confirm before installing or removing.",
    order: 10,
  },
  {
    id: "purge",
    long: "--purge",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Also remove configuration files when removing a package.",
    detail: "Only meaningful with the remove action — the purge action already does this by itself.",
    order: 20,
  },
  {
    id: "simulate",
    short: "-s",
    long: "--simulate",
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
    detail: "Useful after an interrupted or failed install/remove left the package database in an inconsistent state.",
    order: 40,
  },
  {
    id: "fixMissing",
    long: "--fix-missing",
    group: "options",
    kind: "boolean",
    summary: "Attempt to continue when some archives cannot be located.",
    detail: "Skips packages whose files can't be downloaded, instead of failing the whole operation.",
    order: 50,
  },
  {
    id: "downloadOnly",
    short: "-d",
    long: "--download-only",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Download the package files only — don't unpack or install them.",
    detail: "Useful for pre-fetching packages onto a machine that will install them later, e.g. offline.",
    order: 60,
  },
  {
    id: "allowUnauthenticated",
    long: "--allow-unauthenticated",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Install packages even without a verified signature.",
    detail: "Disables the package authentication check that protects against a tampered or spoofed repository. Only use this against a repository you already trust through some other means.",
    order: 70,
  },
  {
    id: "quiet",
    short: "-q",
    long: "--quiet",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Suppress the progress indicator, for output redirected to a log.",
    detail: "The usual choice for scripts and cron jobs, where a terminal progress bar would just clutter the log.",
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
