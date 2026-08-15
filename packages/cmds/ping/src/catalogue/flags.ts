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
 * Real iputils/BSD ping has no long-form spellings for any of these — `-c`,
 * `-i`, `-W`, `-s` are the only real tokens, so `long` is set to the same
 * short spelling as `short` (rather than an invented `--count`/`--interval`/
 * etc. GNU-style long flag that doesn't actually exist). Same trick
 * traceroute's `-m`/`-w` use: the generic text-flag renderer always emits
 * `def.long` verbatim (see `@cmdgen/engine`'s `renderFlag`), so this is also
 * what makes the short form the one that's actually rendered.
 */
export const FLAGS: readonly FlagDef[] = [
  {
    id: "count",
    short: "-c",
    long: "-c",
    group: "probing",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "4", separator: " " },
    summary: "Stop after sending this many packets.",
    detail: "Without this, ping runs forever until manually interrupted with Ctrl-C — see the usability note in the diagnostics panel.",
    order: 10,
  },
  {
    id: "interval",
    short: "-i",
    long: "-i",
    group: "probing",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "1", separator: " ", unit: "s" },
    summary: "Seconds to wait between sending each packet.",
    detail: "Real ping defaults to 1 second; values below 0.2s require root on most systems.",
    order: 20,
  },
  {
    id: "timeout",
    short: "-W",
    long: "-W",
    group: "probing",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "5", separator: " ", unit: "s" },
    summary: "Seconds to wait for a reply before considering that probe lost.",
    detail: "Distinct from -i (the gap between sends) — this bounds how long ping waits for each individual reply.",
    order: 30,
  },
  {
    id: "size",
    short: "-s",
    long: "-s",
    group: "probing",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "56", separator: " ", unit: "bytes" },
    summary: "Number of data bytes to send in each packet.",
    detail: "Real ping defaults to 56 bytes (64 with the 8-byte ICMP header); larger sizes can reveal fragmentation issues along the path.",
    order: 40,
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
