import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/**
 * Every git subcommand gets its OWN small flag catalogue (see `catalogue/<category>.ts`)
 * rather than one giant flat catalogue with 25-way `availableOn` tags — each
 * catalogue is small enough (4-15 flags) that a single "Options" group is
 * plenty, so this one shared taxonomy is reused by every subcommand's
 * catalogue instead of defining ~25 near-identical group files.
 */
export const FLAG_GROUPS = ["options"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  options: {
    id: "options",
    label: "Options",
    summary: "Flags for this subcommand.",
    order: 10,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
