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
    id: "limit",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "number",
    preferShort: true,
    summary: "Limit the number of records",
    detail: "Limit the number of records",
    order: 10,
    arg: {
      placeholder: "10",
      separator: " ",
    },
  },
  {
    id: "file",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "path",
    preferShort: true,
    summary: "Read an alternate wtmp file",
    detail: "Read an alternate wtmp file",
    order: 20,
    arg: {
      placeholder: "/var/log/wtmp",
      separator: " ",
    },
  },
  {
    id: "since",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Show logins since a time",
    detail: "Show logins since a time",
    order: 30,
    arg: {
      placeholder: "yesterday",
      separator: " ",
    },
  },
  {
    id: "until",
    short: "-t",
    long: "-t",
    group: "options",
    kind: "text",
    preferShort: true,
    summary: "Show logins until a time",
    detail: "Show logins until a time",
    order: 40,
    arg: {
      placeholder: "2024-01-01",
      separator: " ",
    },
  },
  {
    id: "dns",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Translate IP addresses back to hostnames",
    detail: "Translate IP addresses back to hostnames",
    order: 50,
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
