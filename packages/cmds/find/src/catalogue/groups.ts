import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["filters", "actions"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  filters: {
    id: "filters",
    label: "Filters",
    summary: "Which entries under the search roots actually match.",
    order: 10,
    collapsedByDefault: false,
  },
  actions: {
    id: "actions",
    label: "Actions",
    summary: "What happens to every entry that matches — handle with care.",
    order: 20,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
