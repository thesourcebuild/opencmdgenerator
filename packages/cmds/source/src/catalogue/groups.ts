import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

// source has no flags of consequence — kept as an empty group taxonomy so
// this package still matches the shape of every other command's catalogue.
export const FLAG_GROUPS = ["options"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  options: {
    id: "options",
    label: "Options",
    summary: "source has no flags of its own — only the script and its positional arguments.",
    order: 10,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
