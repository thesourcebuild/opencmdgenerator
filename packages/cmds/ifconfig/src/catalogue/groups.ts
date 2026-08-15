import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["options"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  options: {
    id: "options",
    label: "Options",
    summary:
      "Windows only — ipconfig.exe's DHCP and adapter-detail flags. POSIX ifconfig's up/down, netmask, and mtu are set directly, not through flags — see the Interface panel.",
    order: 10,
    collapsedByDefault: false,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
