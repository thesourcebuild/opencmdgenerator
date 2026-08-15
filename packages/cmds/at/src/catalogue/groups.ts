import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/**
 * at has zero catalogue flags — every real option this app models
 * (time, job body, job id) is a plain spec-level field instead (see
 * `spec.ts` and `argv/index.ts`). Kept empty, rather than omitted, so the
 * catalogue machinery's shape stays uniform across every command package in
 * this repo — same reasoning as `@cmdgen/crontab`'s `catalogue/groups.ts`.
 */
export const FLAG_GROUPS = [] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
