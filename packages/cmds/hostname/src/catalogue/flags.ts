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
    id: "fqdn",
    short: "-f",
    long: "--fqdn",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show the fully qualified domain name",
    detail: "Show the fully qualified domain name",
    order: 10,
  },
  {
    id: "short",
    short: "-s",
    long: "--short",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show the short host name",
    detail: "Show the short host name",
    order: 20,
  },
  {
    id: "domain",
    short: "-d",
    long: "--domain",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show the DNS domain name",
    detail: "Show the DNS domain name",
    order: 30,
  },
  {
    id: "ipAddress",
    short: "-i",
    long: "--ip-address",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Show host IP addresses",
    detail: "Show host IP addresses",
    order: 40,
  },
  {
    id: "file",
    short: "-F",
    long: "-F",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Read hostname from a file",
    detail: "Read hostname from a file",
    order: 50,
    arg: {
      placeholder: "/etc/hostname",
      separator: " ",
    },
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
