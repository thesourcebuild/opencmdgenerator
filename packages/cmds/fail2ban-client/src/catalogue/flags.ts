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
    id: "socket",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Set socket path",
    detail: "Set socket path",
    order: 10,
    arg: {
      placeholder: "/run/fail2ban/fail2ban.sock",
      separator: " ",
    },
  },
  {
    id: "config",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Set configuration directory",
    detail: "Set configuration directory",
    order: 20,
    arg: {
      placeholder: "/etc/fail2ban",
      separator: " ",
    },
  },
  {
    id: "verbose",
    short: "-v",
    long: "--verbose",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Verbose output",
    detail: "Verbose output",
    order: 30,
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
