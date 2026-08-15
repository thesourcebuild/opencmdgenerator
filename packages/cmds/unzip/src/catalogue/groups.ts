import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["mode", "options"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  mode: {
    id: "mode",
    label: "Mode",
    summary: "What to do with the archive — extract (the default), or one other single action instead.",
    order: 5,
    collapsedByDefault: false,
  },
  options: {
    id: "options",
    label: "Options",
    summary: "Overwrite behavior, output location, filtering, and other modifiers.",
    order: 10,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
