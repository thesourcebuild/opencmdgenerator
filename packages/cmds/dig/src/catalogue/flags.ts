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
    id: "reverse",
    short: "-x",
    long: "-x",
    group: "query",
    kind: "boolean",
    preferShort: true,
    summary: "Reverse (PTR) lookup — treat the name as an address to resolve back to a hostname.",
    detail: "dig automatically builds the in-addr.arpa/ip6.arpa query for you; the record type field is ignored in this mode.",
    order: 10,
  },
  {
    id: "port",
    short: "-p",
    long: "-p",
    group: "query",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "53", separator: " " },
    summary: "Query a nameserver on a non-standard port.",
    detail: "Only useful together with a specific server (@server) — the system resolver is essentially never listening anywhere but 53.",
    order: 20,
  },
  {
    id: "trace",
    long: "+trace",
    group: "output",
    kind: "boolean",
    summary: "Trace the delegation path from the root servers down, instead of asking the resolver directly.",
    detail: "Shows every referral along the way; much slower than a normal lookup, and ignores any server set above since it always starts at the root.",
    order: 30,
  },
  {
    id: "short",
    long: "+short",
    group: "output",
    kind: "boolean",
    summary: "Print just the answer, one value per line.",
    detail: "Strips the header, question, and authority sections — good for scripting, bad for debugging.",
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
