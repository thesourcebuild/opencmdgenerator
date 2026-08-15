import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/**
 * dd has zero catalogue flags — every operand (if=, of=, bs=, count=, skip=,
 * conv=, status=) is a spec-level attached field built manually in
 * `argv/index.ts`, not a catalogue entry (see `catalogue/flags.ts`). Kept
 * empty, rather than omitted, so the catalogue machinery's shape stays
 * uniform across every command package in this repo.
 */
export const FLAG_GROUPS = [] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
