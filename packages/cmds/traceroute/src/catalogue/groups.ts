import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["output", "probing"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  output: {
    id: "output",
    label: "Output",
    summary: "How hop addresses are displayed.",
    order: 10,
    collapsedByDefault: false,
  },
  probing: {
    id: "probing",
    label: "Probing",
    summary: "How probes are sent and how long to wait for a reply. Available flags depend on the target platform above.",
    order: 20,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
