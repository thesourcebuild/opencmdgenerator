import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/**
 * setenforce's one real piece of state (`mode`) is a spec-level enum field,
 * built manually in `argv/index.ts`, not a catalogue entry — see
 * `catalogue/flags.ts`. Kept empty, rather than omitted, so the catalogue
 * machinery's shape stays uniform across every command package in this
 * repo, same reasoning as `@cmdgen/iptables`'s empty `FLAG_GROUPS`.
 */
export const FLAG_GROUPS = [] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
