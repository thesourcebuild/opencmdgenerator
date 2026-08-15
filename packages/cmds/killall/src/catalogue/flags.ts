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
    id: "interactive",
    short: "-i",
    long: "-i",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Ask for confirmation before killing each matching process.",
    detail: "Prompts once per matching process; answer y to kill it, anything else to skip.",
    order: 10,
  },
  {
    id: "verbose",
    short: "-v",
    long: "-v",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Report whether each signal was successfully sent.",
    detail: "Prints a short success/failure line per matching process.",
    order: 20,
  },
  {
    id: "quiet",
    short: "-q",
    long: "-q",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Don't complain if no processes match.",
    detail: "Without this, killall exits with an error message when nothing matches the given name.",
    order: 30,
  },
  {
    id: "signal",
    // `long` is set to the short spelling because the render engine always
    // emits a text-kind flag's `long` field verbatim, ignoring `preferShort`
    // (see `renderFlag` in `@cmdgen/engine`'s `argv/index.ts`) — the same
    // reason `@cmdgen/touch`'s `stamp` flag and `@cmdgen/top`'s
    // iterations/delay/pid/user flags set `long` to their short spelling
    // instead of a separate long name. Real killall also accepts `--signal`;
    // this catalogue models only the one spelling that actually renders.
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "TERM", separator: " " },
    summary: "Send this signal instead of the default SIGTERM.",
    detail: "Accepts a signal name without the SIG prefix (e.g. KILL, HUP) or a number.",
    order: 40,
  },
  {
    id: "olderThan",
    short: "-o",
    long: "--older-than",
    group: "options",
    kind: "text",
    arg: { placeholder: "1h", separator: " " },
    summary: "Only match processes older than this.",
    detail: "A number followed by a unit: s (seconds), m (minutes), h (hours), d (days), w (weeks), M (months), y (years).",
    order: 50,
  },
  {
    id: "youngerThan",
    short: "-y",
    long: "--younger-than",
    group: "options",
    kind: "text",
    arg: { placeholder: "5m", separator: " " },
    summary: "Only match processes younger than this.",
    detail: "Same time-unit syntax as --older-than.",
    order: 60,
  },
  {
    id: "user",
    short: "-u",
    long: "--user",
    group: "options",
    kind: "text",
    arg: { placeholder: "alice", separator: " " },
    summary: "Only match processes owned by this user.",
    detail: "Accepts a username or numeric UID.",
    order: 70,
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
