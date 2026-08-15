import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["display", "sorting", "recursion"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  display: {
    id: "display",
    label: "Display",
    summary: "What information is shown and how.",
    order: 10,
    collapsedByDefault: false,
  },
  sorting: {
    id: "sorting",
    label: "Sorting",
    summary: "The order entries are listed in.",
    order: 20,
    collapsedByDefault: false,
  },
  recursion: {
    id: "recursion",
    label: "Recursion",
    summary: "Whether to descend into subdirectories.",
    order: 30,
    collapsedByDefault: true,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
