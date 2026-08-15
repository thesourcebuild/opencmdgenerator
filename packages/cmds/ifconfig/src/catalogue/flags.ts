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
 * `availableOn` here is the collapsed 2-value tag from `pure.ts`'s
 * `platformFlagTag` ("posix" | "windows"), NOT `IfconfigSpec["platform"]`
 * directly — windows-cmd and windows-powershell share the exact same flag
 * set, since both just invoke the one real ipconfig.exe. POSIX ifconfig's
 * up/down/netmask/mtu are bare keyword tokens, not flags at all — see
 * `spec.ts`'s `state`/`netmask`/`mtu` fields, pushed manually in
 * `argv/index.ts` — so there are no posix-tagged entries here at all.
 */
export const FLAGS: readonly FlagDef[] = [
  // ── Windows (ipconfig.exe) — POSIX ifconfig's equivalents (if any) are
  // spec-level fields, not catalogue flags; see spec.ts. ────────────────────
  {
    id: "all",
    long: "/all",
    group: "options",
    kind: "boolean",
    availableOn: ["windows"],
    summary: "Display detailed configuration for every adapter.",
    detail: "Without this, ipconfig shows only a brief summary per adapter.",
    order: 10,
  },
  {
    id: "release",
    long: "/release",
    group: "options",
    kind: "boolean",
    availableOn: ["windows"],
    conflictsWith: ["renew"],
    summary: "Release the DHCP lease for the adapter(s).",
    detail: "Mutually exclusive with /renew — release and renew are opposite operations.",
    order: 20,
  },
  {
    id: "renew",
    long: "/renew",
    group: "options",
    kind: "boolean",
    availableOn: ["windows"],
    conflictsWith: ["release"],
    summary: "Renew the DHCP lease for the adapter(s).",
    detail: "Mutually exclusive with /release.",
    order: 30,
  },
  {
    id: "flushDns",
    long: "/flushdns",
    group: "options",
    kind: "boolean",
    availableOn: ["windows"],
    summary: "Clear the DNS resolver cache.",
    detail: "Forces subsequent lookups to query DNS servers fresh instead of using cached results.",
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
