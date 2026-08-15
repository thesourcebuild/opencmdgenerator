import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  validateCatalogue as validateCatalogueGeneric,
  type DangerLevel,
  type FlagArgSpec,
  type FlagDef as FlagDefGeneric,
  type FlagEnumOption,
  type FlagKind,
} from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

/**
 * The scoped flag subset this package models — see spec.ts's header comment
 * for why this is deliberately not ffmpeg's full option surface.
 *
 * `order` is globally unique and load-bearing: anything below `OUTPUT_ORDER`
 * (see ../argv.ts) renders BEFORE the first `-i`, matching real
 * ffmpeg's "global options, then inputs, then output options" grammar.
 */
export const FLAGS: readonly FlagDef[] = [
  // ══ overwrite control — global, so it renders before any -i ════════════════
  {
    id: "overwrite",
    long: "-y",
    group: "overwrite",
    kind: "boolean",
    danger: "caution",
    conflictsWith: ["noOverwrite"],
    summary: "Overwrite the output file if it already exists, without asking.",
    detail:
      "ffmpeg never touches the input files — this only affects the output. Without -y or -n, real ffmpeg stops and prompts interactively when the output already exists, which this generator cannot represent.",
    order: 100,
  },
  {
    id: "noOverwrite",
    long: "-n",
    group: "overwrite",
    kind: "boolean",
    conflictsWith: ["overwrite"],
    summary: "Never overwrite the output file — fail instead if it exists.",
    detail: "The safe counterpart to -y. Passing both is a contradiction real ffmpeg rejects (or prompts oddly on).",
    order: 110,
  },

  // ══ video ═══════════════════════════════════════════════════════════════
  {
    id: "videoCodec",
    long: "-c:v",
    group: "video",
    kind: "text",
    arg: { placeholder: "libx264", separator: " " },
    summary: "Video codec to encode with.",
    detail:
      "Common values: libx264 (H.264, universally compatible), libx265 (H.265/HEVC, smaller but less widely supported), libvpx-vp9, or copy to stream-copy the existing encoded video untouched (no re-encoding, near-instant).",
    order: 500,
  },
  {
    id: "videoBitrate",
    long: "-b:v",
    group: "video",
    kind: "text",
    arg: { placeholder: "2M", separator: " " },
    summary: "Target video bitrate.",
    detail: "Accepts ffmpeg's usual suffixes, e.g. 2M or 2000k. An average-bitrate target, not a hard cap unless paired with -maxrate (not modeled here).",
    order: 510,
  },
  {
    id: "resolution",
    long: "-s",
    group: "video",
    kind: "text",
    arg: { placeholder: "1280x720", separator: " " },
    summary: "Output frame size, WIDTHxHEIGHT.",
    detail: "Scales the video to this exact size. Does not preserve aspect ratio by itself — pick dimensions that already match the source's ratio, or the picture stretches.",
    order: 520,
  },
  {
    id: "frameRate",
    long: "-r",
    group: "video",
    kind: "text",
    arg: { placeholder: "30", separator: " " },
    summary: "Output frame rate.",
    detail: "Accepts a plain number (30) or a fraction (30000/1001) for NTSC-style rates. As an output option it drops or duplicates frames to hit this rate.",
    order: 530,
  },
  {
    id: "preset",
    long: "-preset",
    group: "video",
    kind: "enum",
    options: [
      { value: "none", label: "Not set (encoder default)", renders: "" },
      { value: "ultrafast", label: "ultrafast — fastest encode, largest file", renders: "-preset ultrafast" },
      { value: "superfast", label: "superfast", renders: "-preset superfast" },
      { value: "veryfast", label: "veryfast", renders: "-preset veryfast" },
      { value: "faster", label: "faster", renders: "-preset faster" },
      { value: "fast", label: "fast", renders: "-preset fast" },
      { value: "medium", label: "medium — libx264's own default", renders: "-preset medium" },
      { value: "slow", label: "slow", renders: "-preset slow" },
      { value: "slower", label: "slower", renders: "-preset slower" },
      { value: "veryslow", label: "veryslow — slowest encode, smallest file", renders: "-preset veryslow" },
    ],
    summary: "Encoding speed vs. compression efficiency tradeoff.",
    detail: "x264/x265-specific: slower presets spend more CPU time to squeeze the file smaller at the same quality. Has no effect on other encoders.",
    order: 540,
  },
  {
    id: "crf",
    long: "-crf",
    group: "video",
    kind: "number",
    arg: { placeholder: "23", min: 0, max: 51, separator: " " },
    summary: "Constant Rate Factor — quality target for libx264/libx265.",
    detail: "Lower is higher quality and larger output: 0 is lossless, ~18-23 is visually good enough for most web delivery, 51 is worst quality. Targets quality rather than a specific file size or bitrate.",
    order: 550,
  },
  {
    id: "pixelFormat",
    long: "-pix_fmt",
    group: "video",
    kind: "text",
    arg: { placeholder: "yuv420p", separator: " " },
    summary: "Pixel format of the encoded video.",
    detail: "yuv420p is the safe, maximally-compatible choice — without it some encoders default to a 4:4:4 or 10-bit format that many players and older devices cannot decode.",
    order: 560,
  },
  {
    id: "noVideo",
    long: "-vn",
    group: "video",
    kind: "boolean",
    summary: "Drop the video stream entirely.",
    detail: "The usual way to extract audio-only output. Makes every other video option in this group a no-op.",
    order: 570,
  },

  // ══ audio ═══════════════════════════════════════════════════════════════
  {
    id: "audioCodec",
    long: "-c:a",
    group: "audio",
    kind: "text",
    arg: { placeholder: "aac", separator: " " },
    summary: "Audio codec to encode with.",
    detail: "Common values: aac (universally compatible), libmp3lame (MP3), or copy to stream-copy the existing encoded audio untouched.",
    order: 600,
  },
  {
    id: "audioBitrate",
    long: "-b:a",
    group: "audio",
    kind: "text",
    arg: { placeholder: "128k", separator: " " },
    summary: "Target audio bitrate.",
    detail: "Accepts ffmpeg's usual suffixes, e.g. 128k or 0.128M. Has no effect when the audio codec is copy.",
    order: 610,
  },
  {
    id: "noAudio",
    long: "-an",
    group: "audio",
    kind: "boolean",
    summary: "Drop the audio stream entirely.",
    detail: "Makes every other audio option in this group a no-op.",
    order: 620,
  },

  // ══ trimming ════════════════════════════════════════════════════════════
  {
    id: "startTime",
    long: "-ss",
    group: "timing",
    kind: "text",
    arg: { placeholder: "00:00:30", separator: " " },
    summary: "Start reading/encoding at this position.",
    detail: "Accepts HH:MM:SS(.ms) or a plain seconds count. As an output-side option (its position here), it seeks accurately but re-decodes from the start of the file, which is slower than input-side seeking — not modeled separately in this scoped subset.",
    order: 700,
  },
  {
    id: "duration",
    long: "-t",
    group: "timing",
    kind: "text",
    arg: { placeholder: "00:00:10", separator: " " },
    summary: "Stop after this much output has been written.",
    detail: "A duration, not an end timestamp — combine with -ss's start time to cut a clip: -ss 30 -t 10 produces a 10-second clip starting at the 30-second mark.",
    order: 710,
  },
];

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);
export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}

/** Sanity check for the catalogue itself, exercised by the test suite. */
export function validateCatalogue(): string[] {
  return validateCatalogueGeneric(FLAGS);
}
