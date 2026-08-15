import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["output", "options"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  output: {
    id: "output",
    label: "Output",
    summary: "How much chgrp reports about what it did.",
    order: 10,
    collapsedByDefault: false,
  },
  options: {
    id: "options",
    label: "Options",
    summary: "Recursion, and copying group ownership from another file.",
    order: 20,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
