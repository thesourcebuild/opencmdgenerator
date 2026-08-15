import { orderedGroups as orderedGroupsGeneric, type FlagGroupMeta } from "@cmdgen/engine";

/** Coarse groupings over this package's scoped flag subset — not a mirror of ffmpeg's own `-h full` sections, which run far deeper than what is modeled here. */
export const FLAG_GROUPS = ["overwrite", "video", "audio", "timing"] as const;
export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type { FlagGroupMeta };

export const FLAG_GROUP_META: Record<FlagGroup, FlagGroupMeta<FlagGroup>> = {
  overwrite: {
    id: "overwrite",
    label: "Overwrite control",
    summary: "What happens when the output file already exists.",
    order: 10,
    collapsedByDefault: false,
  },
  video: {
    id: "video",
    label: "Video",
    summary: "Video codec, quality, size and frame rate.",
    order: 20,
    collapsedByDefault: false,
  },
  audio: {
    id: "audio",
    label: "Audio",
    summary: "Audio codec and bitrate.",
    order: 30,
    collapsedByDefault: false,
  },
  timing: {
    id: "timing",
    label: "Trimming",
    summary: "Cutting a clip out of the input(s).",
    order: 40,
    collapsedByDefault: true,
  },
};

export const orderedGroups = (): FlagGroupMeta<FlagGroup>[] => orderedGroupsGeneric(FLAG_GROUP_META);
