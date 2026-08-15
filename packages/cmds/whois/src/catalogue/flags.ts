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
 * Real whois supports both `-h` and `--host` for this option, but the
 * generic text-flag renderer always emits `def.long` verbatim (see
 * `@cmdgen/engine`'s `renderFlag`) — there's no independent short/long
 * toggle for non-boolean flags the way `preferShort` provides for booleans.
 * `long` is set to the short spelling here, same trick traceroute's `-m`/
 * `-w` and ping's `-c`/`-i`/`-W`/`-s` use, since `-h SERVER` is by far the
 * more commonly typed form.
 */
export const FLAGS: readonly FlagDef[] = [
  {
    id: "host",
    short: "-h",
    long: "-h",
    group: "query",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "whois.arin.net", separator: " " },
    summary: "Query a specific whois server instead of letting whois pick one automatically.",
    detail: "Useful for regional registries (ARIN, RIPE, APNIC) that hold authoritative records whois's own referral chain might not reach directly.",
    order: 10,
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
