import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export type { FlagGroupMeta };

/**
 * kill's POSIX side has no flags (see src/spec.ts) but its PowerShell side has
 * exactly one (-Force), so there is now one group to hold it — see
 * catalogue/flags.ts.
 */
export const FLAG_GROUPS = ["options"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  options: {
    id: "options",
    label: "Options",
    summary: "PowerShell-only — POSIX kill has no flags here (the signal picker above covers it).",
    order: 10,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
