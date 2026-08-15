import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/**
 * route has zero catalogue flags — its entire syntax is bare words (`route`,
 * `route add DEST gw GW`, `route del DEST gw GW`), with no `-flag` involved
 * anywhere (see `catalogue/flags.ts`). Kept empty, rather than omitted, so
 * the catalogue machinery's shape stays uniform across every command package
 * in this repo — same reasoning as `@cmdgen/service`'s `catalogue/groups.ts`.
 */
export const FLAG_GROUPS = [] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
