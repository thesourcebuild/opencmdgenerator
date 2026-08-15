import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/**
 * ufw has zero catalogue flags — mode, port, and protocol are all
 * spec-level fields combined and pushed manually in `argv/index.ts`, not
 * catalogue entries (see `catalogue/flags.ts`). Kept empty, rather than
 * omitted, so the catalogue machinery's shape stays uniform across every
 * command package in this repo.
 */
export const FLAG_GROUPS = [] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
