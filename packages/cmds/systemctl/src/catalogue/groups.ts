import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["scope", "output", "unit", "operation", "boot", "host", "misc"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  scope: {
    id: "scope",
    label: "Scope",
    summary: "System/user/global manager selection.",
    order: 10,
    collapsedByDefault: false,
  },
  output: {
    id: "output",
    label: "Output & filtering",
    summary: "List/status/show filters, formatting, pager behavior, and quiet output.",
    order: 20,
    collapsedByDefault: false,
  },
  unit: {
    id: "unit",
    label: "Unit filters",
    summary: "Unit type/state/property filters and dependency traversal controls.",
    order: 30,
    collapsedByDefault: true,
  },
  operation: {
    id: "operation",
    label: "Operation behavior",
    summary: "Job modes, enablement behavior, kill/clean/edit/bind options, and execution controls.",
    order: 40,
    collapsedByDefault: true,
  },
  boot: {
    id: "boot",
    label: "Boot/system control",
    summary: "Reboot/poweroff/sleep manager options.",
    order: 50,
    collapsedByDefault: true,
  },
  host: {
    id: "host",
    label: "Remote/container",
    summary: "Operate against a remote host, local container, image, or alternate root.",
    order: 60,
    collapsedByDefault: true,
  },
  misc: {
    id: "misc",
    label: "Misc",
    summary: "Help/version and less-common global switches.",
    order: 70,
    collapsedByDefault: true,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
