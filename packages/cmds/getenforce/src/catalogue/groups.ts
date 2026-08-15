import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/**
 * getenforce has zero catalogue flags at all — it takes no arguments.
 * Kept empty, rather than omitted, so the catalogue machinery's shape stays
 * uniform across every command package in this repo, same reasoning as
 * `@cmdgen/iptables`'s empty `FLAG_GROUPS`.
 */
export const FLAG_GROUPS = [] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
