import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = ["source", "filter", "output", "pager", "maintenance", "fss", "misc"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  source: { id: "source", label: "Source", summary: "Select which journal files or manager scope to read.", order: 10, collapsedByDefault: false },
  filter: { id: "filter", label: "Filtering", summary: "Time, boot, unit, priority, identifier, and message filters.", order: 20, collapsedByDefault: false },
  output: { id: "output", label: "Output", summary: "Formatting, field selection, line count, ordering, and live follow behavior.", order: 30, collapsedByDefault: false },
  pager: { id: "pager", label: "Pager", summary: "Pager and end-of-journal controls.", order: 40, collapsedByDefault: true },
  maintenance: { id: "maintenance", label: "Maintenance commands", summary: "Journal disk usage, vacuuming, verification, rotation, flush, and catalog maintenance.", order: 50, collapsedByDefault: true },
  fss: { id: "fss", label: "Forward Secure Sealing", summary: "Setup and verification options for sealed journals.", order: 60, collapsedByDefault: true },
  misc: { id: "misc", label: "Misc", summary: "Help/version and less-common switches.", order: 70, collapsedByDefault: true },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
