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
    id: "tcp",
    short: "-t",
    long: "--tcp",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show TCP sockets.",
    detail: "Combine with -u to show both TCP and UDP — omitting both shows every socket type netstat knows about.",
    order: 10,
  },
  {
    id: "udp",
    short: "-u",
    long: "--udp",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show UDP sockets.",
    detail: "Combine with -t to show both TCP and UDP — omitting both shows every socket type netstat knows about.",
    order: 20,
  },
  {
    id: "listening",
    short: "-l",
    long: "--listening",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show only listening sockets.",
    detail: "Servers waiting for incoming connections — the everyday \"what's listening on this box\" view.",
    order: 30,
  },
  {
    id: "numeric",
    short: "-n",
    long: "--numeric",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show addresses and ports as numbers, skipping DNS/service-name lookups.",
    detail: "Significantly speeds up the listing and avoids DNS lookups for every remote address.",
    order: 40,
  },
  {
    id: "program",
    short: "-p",
    long: "--program",
    group: "options",
    kind: "boolean",
    preferShort: true,
    danger: "caution",
    summary: "Show the PID and program name owning each socket.",
    detail: "Needs root to see sockets owned by other users, and reveals which programs other users on a shared box are running.",
    order: 50,
  },
  {
    id: "route",
    short: "-r",
    long: "--route",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show the kernel routing table instead of socket connections.",
    detail: "Same information @cmdgen/route's own show mode reports — netstat -r is the traditional way to see it.",
    order: 60,
  },
  {
    id: "all",
    short: "-a",
    long: "--all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show both listening and non-listening sockets.",
    detail: "Without this, netstat hides sockets that aren't in the LISTEN state by default for some socket types.",
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
