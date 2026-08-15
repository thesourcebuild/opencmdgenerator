import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["matching", "output"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  matching: {
    id: "matching",
    label: "Matching",
    summary: "How the pattern is interpreted and matched.",
    order: 10,
    collapsedByDefault: false,
  },
  output: {
    id: "output",
    label: "Output",
    summary: "What's printed for each match. Available flags depend on the target platform above.",
    order: 20,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
