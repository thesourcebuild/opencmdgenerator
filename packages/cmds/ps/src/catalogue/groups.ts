import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["selection", "format"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  selection: {
    id: "selection",
    label: "Selection",
    summary: "Which processes to include in the listing.",
    order: 10,
    collapsedByDefault: false,
  },
  format: {
    id: "format",
    label: "Format",
    summary: "How to display the selected processes — layout, columns, and sort order.",
    order: 20,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
