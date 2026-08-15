import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["removal", "output"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  removal: {
    id: "removal",
    label: "Removal",
    summary: "What gets deleted and how forcefully. Read carefully — there is no undo.",
    order: 10,
    collapsedByDefault: false,
  },
  output: {
    id: "output",
    label: "Output",
    summary: "What rm reports while it runs.",
    order: 20,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
