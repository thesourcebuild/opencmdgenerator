import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  isAvailableOn as isAvailableOnGeneric,
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
 * `platformFlagTag` ("posix" | "windows"), NOT `TraceroutePlatform`
 * directly — windows-cmd and windows-powershell share the exact same flag
 * set, since both just invoke the one real tracert.exe.
 */
export const FLAGS: readonly FlagDef[] = [
  // ── POSIX (traceroute) ────────────────────────────────────────────────────
  {
    id: "numeric",
    short: "-n",
    long: "-n",
    group: "output",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Print hop addresses numerically, skipping DNS lookups.",
    detail: "Significantly speeds up the trace since it avoids a reverse-DNS lookup for every hop.",
    order: 10,
  },
  {
    id: "maxHops",
    short: "-m",
    long: "-m",
    group: "probing",
    kind: "text",
    preferShort: true,
    availableOn: ["posix"],
    arg: { placeholder: "30", separator: " " },
    summary: "Set the maximum number of hops to probe.",
    detail: "Real traceroute defaults to 30; lower this to stop tracing sooner for a nearby target, or raise it for a very distant one.",
    order: 10,
  },
  {
    id: "waitTime",
    short: "-w",
    long: "-w",
    group: "probing",
    kind: "text",
    preferShort: true,
    availableOn: ["posix"],
    arg: { placeholder: "5", separator: " " },
    summary: "Seconds to wait for a response from each probe.",
    detail: "Hops that don't respond within this window are shown as '*' (timeout).",
    order: 20,
  },
  {
    id: "icmp",
    short: "-I",
    long: "-I",
    group: "probing",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    summary: "Use ICMP ECHO probes instead of the default UDP probes.",
    detail: "Some networks block UDP probes but allow ICMP (the same protocol ping uses).",
    order: 30,
  },
  {
    id: "ipv4",
    short: "-4",
    long: "-4",
    group: "probing",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    conflictsWith: ["ipv6"],
    summary: "Force IPv4.",
    detail: "Mutually exclusive with -6.",
    order: 40,
  },
  {
    id: "ipv6",
    short: "-6",
    long: "-6",
    group: "probing",
    kind: "boolean",
    preferShort: true,
    availableOn: ["posix"],
    conflictsWith: ["ipv4"],
    summary: "Force IPv6.",
    detail: "Mutually exclusive with -4.",
    order: 50,
  },

  // ── Windows (tracert) ─────────────────────────────────────────────────────
  {
    id: "noResolve",
    short: "-d",
    long: "-d",
    group: "output",
    kind: "boolean",
    preferShort: true,
    availableOn: ["windows"],
    summary: "Do not resolve hop addresses to hostnames.",
    detail: "The Windows equivalent of traceroute's -n; speeds up the trace by skipping reverse-DNS lookups.",
    order: 10,
  },
  {
    id: "maxHopsWin",
    short: "-h",
    long: "-h",
    group: "probing",
    kind: "text",
    preferShort: true,
    availableOn: ["windows"],
    arg: { placeholder: "30", separator: " " },
    summary: "Set the maximum number of hops to probe.",
    detail: "tracert's flag for the same concept as traceroute's -m; note the different letter.",
    order: 10,
  },
  {
    id: "waitTimeWin",
    short: "-w",
    long: "-w",
    group: "probing",
    kind: "text",
    preferShort: true,
    availableOn: ["windows"],
    arg: { placeholder: "4000", separator: " " },
    summary: "Milliseconds to wait for each reply.",
    detail: "Unlike traceroute's -w (seconds), tracert's -w is in MILLISECONDS — don't reuse a value copied from the POSIX form above.",
    order: 20,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isAvailableOn(flag: FlagDef, tag: string): boolean {
  return isAvailableOnGeneric(flag, tag);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
