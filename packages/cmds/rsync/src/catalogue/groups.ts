import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

export const FLAG_GROUPS = [
  "core",
  "attributes",
  "selection",
  "deletion",
  "resume",
  "bandwidth",
  "output",
  "backup",
  "remote",
  "advanced",
] as const;

export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  core: {
    id: "core",
    label: "Core",
    summary: "What gets transferred and how.",
    order: 10,
    collapsedByDefault: false,
  },
  attributes: {
    id: "attributes",
    label: "Attributes",
    summary: "Which file metadata is preserved.",
    order: 20,
    collapsedByDefault: false,
  },
  selection: {
    id: "selection",
    label: "Selection",
    summary: "Which files are considered, and how they are compared.",
    order: 30,
    collapsedByDefault: false,
  },
  deletion: {
    id: "deletion",
    label: "Deletion",
    summary: "Removing files from the destination. Read carefully.",
    order: 40,
    collapsedByDefault: false,
  },
  resume: {
    id: "resume",
    label: "Partial transfers",
    summary: "Resuming interrupted transfers and writing in place.",
    order: 50,
    collapsedByDefault: true,
  },
  bandwidth: {
    id: "bandwidth",
    label: "Bandwidth & size",
    summary: "Throttling and size limits.",
    order: 60,
    collapsedByDefault: true,
  },
  output: {
    id: "output",
    label: "Output",
    summary: "Verbosity, progress reporting, and logging.",
    order: 70,
    collapsedByDefault: false,
  },
  backup: {
    id: "backup",
    label: "Backup",
    summary: "Keeping copies of files that would be replaced.",
    order: 80,
    collapsedByDefault: true,
  },
  remote: {
    id: "remote",
    label: "Remote",
    summary: "SSH transport and remote rsync invocation.",
    order: 90,
    collapsedByDefault: true,
  },
  advanced: {
    id: "advanced",
    label: "Advanced",
    summary: "Rarely needed, easy to get wrong.",
    order: 100,
    collapsedByDefault: true,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
