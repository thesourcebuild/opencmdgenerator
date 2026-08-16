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
    summary: "Show TCP sockets",
    detail: "Show TCP sockets",
    order: 10,
  },
  {
    id: "udp",
    short: "-u",
    long: "--udp",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show UDP sockets",
    detail: "Show UDP sockets",
    order: 20,
  },
  {
    id: "listening",
    short: "-l",
    long: "--listening",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show listening sockets",
    detail: "Show listening sockets",
    order: 30,
  },
  {
    id: "all",
    short: "-a",
    long: "--all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show all sockets",
    detail: "Show all sockets",
    order: 40,
  },
  {
    id: "numeric",
    short: "-n",
    long: "--numeric",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Do not resolve names",
    detail: "Do not resolve names",
    order: 50,
  },
  {
    id: "processes",
    short: "-p",
    long: "--processes",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show owning processes",
    detail: "Show owning processes",
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
