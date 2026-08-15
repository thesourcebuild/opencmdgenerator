import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["connection", "authentication", "forwarding", "multiplexing", "output"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  connection: {
    id: "connection",
    label: "Connection",
    summary: "How ssh reaches and negotiates with the host.",
    order: 10,
    collapsedByDefault: false,
  },
  authentication: {
    id: "authentication",
    label: "Authentication",
    summary: "Cipher/MAC selection, PKCS#11 tokens, and GSSAPI credential forwarding.",
    order: 15,
    collapsedByDefault: true,
  },
  forwarding: {
    id: "forwarding",
    label: "Forwarding",
    summary: "Port forwarding and agent/X11 forwarding. Read carefully — these extend trust to the remote host.",
    order: 20,
    collapsedByDefault: true,
  },
  multiplexing: {
    id: "multiplexing",
    label: "Connection sharing",
    summary: "Reuse one connection for several sessions via a control socket (ControlMaster).",
    order: 25,
    collapsedByDefault: true,
  },
  output: {
    id: "output",
    label: "Output",
    summary: "Verbosity and session behavior.",
    order: 30,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
