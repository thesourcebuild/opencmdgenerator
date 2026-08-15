import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["connection", "transfer", "protocol", "output"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  connection: {
    id: "connection",
    label: "Connection",
    summary: "How scp reaches and negotiates with the remote host.",
    order: 10,
    collapsedByDefault: false,
  },
  transfer: {
    id: "transfer",
    label: "Transfer",
    summary: "What gets copied and how — recursion, attributes, compression.",
    order: 20,
    collapsedByDefault: false,
  },
  protocol: {
    id: "protocol",
    label: "Protocol",
    summary: "Which underlying transfer protocol scp uses, and how it's invoked.",
    order: 30,
    collapsedByDefault: true,
  },
  output: {
    id: "output",
    label: "Output",
    summary: "Verbosity.",
    order: 40,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
