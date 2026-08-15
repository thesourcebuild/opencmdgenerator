import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/**
 * Every openssl subcommand gets its OWN small flag catalogue (see
 * `catalogue/<category>.ts`) rather than one giant flat catalogue with a
 * 54-way `availableOn` tag — each catalogue is small enough (2-15 flags)
 * that a single "Options" group is plenty. Mirrors `@cmdgen/git`'s
 * `catalogue/groups.ts` exactly.
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
