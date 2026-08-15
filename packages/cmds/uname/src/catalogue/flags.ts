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
    id: "all",
    short: "-a",
    long: "--all",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print every piece of information, in a fixed order.",
    detail: "Kernel name, node hostname, kernel release, kernel version, machine, processor, and operating system, all on one line.",
    order: 10,
  },
  {
    id: "kernelName",
    short: "-s",
    long: "--kernel-name",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the kernel name.",
    detail: "The default when no flags are given at all — e.g. \"Linux\" or \"Darwin\".",
    order: 20,
  },
  {
    id: "nodename",
    short: "-n",
    long: "--nodename",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the network node hostname.",
    detail: "The same name hostname would print.",
    order: 30,
  },
  {
    id: "kernelRelease",
    short: "-r",
    long: "--kernel-release",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the kernel release.",
    detail: "e.g. \"6.8.0-45-generic\" — the same value uname -r or the release field of uname -a shows.",
    order: 40,
  },
  {
    id: "kernelVersion",
    short: "-v",
    long: "--kernel-version",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the kernel version.",
    detail: "The build timestamp/details string, distinct from the kernel release above — often much longer.",
    order: 50,
  },
  {
    id: "machine",
    short: "-m",
    long: "--machine",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the hardware architecture.",
    detail: "e.g. \"x86_64\" or \"arm64\".",
    order: 60,
  },
  {
    id: "processor",
    short: "-p",
    long: "--processor",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the processor type, or \"unknown\" if it can't be determined.",
    detail: "Often just prints \"unknown\" on Linux in practice — --machine is the more reliable way to get the architecture.",
    order: 70,
  },
  {
    id: "operatingSystem",
    short: "-o",
    long: "--operating-system",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Print the operating system name.",
    detail: "e.g. \"GNU/Linux\" — often more specific than the kernel name alone.",
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
