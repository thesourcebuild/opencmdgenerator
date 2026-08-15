import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/** Mirrors the section headings of GNU tar's own `--help`, so the form can be audited against it directly. */
export const FLAG_GROUPS = [
  "compression",
  "selection",
  "matching",
  "modifiers",
  "overwrite",
  "outputStream",
  "attributes",
  "xattrs",
  "format",
  "paths",
  "output",
  "incremental",
  "device",
  "compat",
] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  compression: {
    id: "compression",
    label: "Compression",
    summary: "How the archive stream is compressed. tar only bundles — compression is an external filter.",
    order: 10,
    collapsedByDefault: false,
  },
  selection: {
    id: "selection",
    label: "What goes in",
    summary: "Which files are picked up, and which are skipped.",
    order: 20,
    collapsedByDefault: false,
  },
  matching: {
    id: "matching",
    label: "Pattern matching",
    summary: "How include and exclude patterns are interpreted.",
    order: 30,
    collapsedByDefault: true,
  },
  modifiers: {
    id: "modifiers",
    label: "Operation modifiers",
    summary: "Adjustments to how the chosen operation runs.",
    order: 40,
    collapsedByDefault: true,
  },
  overwrite: {
    id: "overwrite",
    label: "Overwrite control",
    summary: "What happens to files already on disk when extracting.",
    order: 50,
    collapsedByDefault: false,
  },
  outputStream: {
    id: "outputStream",
    label: "Output stream",
    summary: "Sending member data somewhere other than the filesystem.",
    order: 60,
    collapsedByDefault: true,
  },
  attributes: {
    id: "attributes",
    label: "Ownership & metadata",
    summary: "Permissions, owners, timestamps and sort order.",
    order: 70,
    collapsedByDefault: true,
  },
  xattrs: {
    id: "xattrs",
    label: "Extended attributes",
    summary: "ACLs, xattrs and SELinux contexts. Needs the pax format to store.",
    order: 80,
    collapsedByDefault: true,
  },
  format: {
    id: "format",
    label: "Archive format",
    summary: "The on-disk container format. Affects portability and which metadata can be stored.",
    order: 90,
    collapsedByDefault: true,
  },
  paths: {
    id: "paths",
    label: "Paths & links",
    summary: "How member names are stored and rewritten, and how symlinks are treated.",
    order: 100,
    collapsedByDefault: false,
  },
  output: {
    id: "output",
    label: "Informative output",
    summary: "What tar reports while it runs.",
    order: 110,
    collapsedByDefault: false,
  },
  incremental: {
    id: "incremental",
    label: "Incremental & sparse",
    summary: "Snapshot-based incremental backups and sparse-file handling.",
    order: 120,
    collapsedByDefault: true,
  },
  device: {
    id: "device",
    label: "Blocking & devices",
    summary: "Record sizes and multi-volume/tape handling. Rarely needed for ordinary files.",
    order: 130,
    collapsedByDefault: true,
  },
  compat: {
    id: "compat",
    label: "Compatibility",
    summary: "Legacy switches kept for scripts that still use them.",
    order: 140,
    collapsedByDefault: true,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
