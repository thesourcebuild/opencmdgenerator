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
  {
    id: "follow",
    short: "-f",
    long: "--follow",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Keep the journal open and print new entries as they arrive.",
    detail: "tail -f's journal equivalent — watching logs live. Ctrl-C stops it.",
    order: 10,
  },
  {
    // `long` is set to the short spelling because the render engine always
    // emits a number/text/path-kind flag's `long` field verbatim, ignoring
    // `preferShort` (see `renderFlag` in `@cmdgen/engine`'s `argv/index.ts`)
    // — the same reason `@cmdgen/tail`'s `linesCount` flag and
    // `@cmdgen/killall`'s `signal` flag set `long` to their short spelling
    // instead of a separate long name. Real journalctl also accepts
    // `--lines`; this catalogue models only the one spelling that actually
    // renders.
    id: "lines",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "number",
    preferShort: true,
    arg: { placeholder: "10", separator: " " },
    summary: "Show only the last N entries instead of the whole journal.",
    detail: "Without this, journalctl prints every entry it has, which can be enormous.",
    order: 20,
  },
  {
    id: "priority",
    short: "-p",
    long: "--priority",
    group: "options",
    kind: "enum",
    preferShort: true,
    options: [
      { value: "none", label: "Every priority (default)", renders: "" },
      { value: "emerg", label: "emerg (0) — system unusable", renders: "-p emerg" },
      { value: "alert", label: "alert (1) — immediate action needed", renders: "-p alert" },
      { value: "crit", label: "crit (2) — critical condition", renders: "-p crit" },
      { value: "err", label: "err (3) — error", renders: "-p err" },
      { value: "warning", label: "warning (4)", renders: "-p warning" },
      { value: "notice", label: "notice (5)", renders: "-p notice" },
      { value: "info", label: "info (6)", renders: "-p info" },
      { value: "debug", label: "debug (7)", renders: "-p debug" },
    ],
    summary: "Only show entries at or above this priority level.",
    detail: "Matches syslog priority levels — e.g. \"err\" also includes crit, alert, and emerg, not just err itself.",
    order: 30,
  },
  {
    id: "boot",
    short: "-b",
    long: "--boot",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Only show entries from the current boot.",
    detail: "Without this, the journal spans every boot it has retained.",
    order: 40,
  },
  {
    id: "since",
    long: "--since",
    group: "options",
    kind: "text",
    arg: { placeholder: "\"2024-01-01 00:00:00\"", separator: "=" },
    summary: "Only show entries at or after this date/time.",
    detail: "Accepts an absolute timestamp or a relative form like \"yesterday\" or \"-1 hour\".",
    order: 50,
  },
  {
    id: "until",
    long: "--until",
    group: "options",
    kind: "text",
    arg: { placeholder: "\"2024-01-02 00:00:00\"", separator: "=" },
    summary: "Only show entries at or before this date/time.",
    detail: "Same accepted formats as --since — combine both for a bounded window.",
    order: 60,
  },
  {
    id: "reverse",
    short: "-r",
    long: "--reverse",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show the newest entries first instead of oldest first.",
    detail: "Reverses the normal chronological order journalctl prints in.",
    order: 70,
  },
  {
    id: "dmesg",
    short: "-k",
    long: "--dmesg",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show only kernel messages, the journal's equivalent of dmesg.",
    detail: "Equivalent to journalctl -k, filtering out every non-kernel entry.",
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
