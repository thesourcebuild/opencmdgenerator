import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["which-time", "time-source", "options"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  "which-time": {
    id: "which-time",
    label: "Which timestamp",
    summary: "Limit the update to just access time or just modification time.",
    order: 10,
    collapsedByDefault: false,
  },
  "time-source": {
    id: "time-source",
    label: "Time source",
    summary: "Where the new timestamp comes from — defaults to now.",
    order: 20,
    collapsedByDefault: false,
  },
  options: {
    id: "options",
    label: "Options",
    summary: "Creation and symlink behavior.",
    order: 30,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
