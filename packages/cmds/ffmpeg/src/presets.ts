import type { Preset } from "@cmdgen/engine";
import type { FfmpegSpec, ShellDialect } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): FfmpegSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    inputFiles: [""],
    outputFile: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<FfmpegSpec>[] = [
  {
    id: "convert-mp4",
    label: "Convert to MP4 (H.264/AAC)",
    summary: "The universally-compatible default: H.264 video, AAC audio.",
    apply: (spec) => ({ ...spec, flags: { ...spec.flags, videoCodec: "libx264", audioCodec: "aac" } }),
  },
  {
    id: "extract-audio",
    label: "Extract audio only",
    summary: "Drops the video stream and stream-copies the audio track as-is — fast, no quality loss.",
    apply: (spec) => ({ ...spec, flags: { ...spec.flags, noVideo: true, audioCodec: "copy" } }),
  },
  {
    id: "compress-web-crf",
    label: "Compress for web (CRF)",
    summary: "Constant-quality H.264 at a sensible default (CRF 23, medium preset) — the standard \"good enough, small enough\" web encode.",
    apply: (spec) => ({
      ...spec,
      flags: { ...spec.flags, videoCodec: "libx264", audioCodec: "aac", crf: 23, preset: "medium" },
    }),
  },
  {
    id: "resize-video",
    label: "Resize video",
    summary: "Re-encodes at 1280x720 (H.264), keeping the rest of the pipeline as-is.",
    apply: (spec) => ({ ...spec, flags: { ...spec.flags, resolution: "1280x720", videoCodec: "libx264" } }),
  },
  {
    id: "trim-clip",
    label: "Trim a clip (start + duration)",
    summary: "Fast trim via stream copy — no re-encoding, so it runs in roughly the time it takes to read the bytes.",
    apply: (spec) => ({
      ...spec,
      flags: { ...spec.flags, startTime: "00:00:10", duration: "00:00:30", videoCodec: "copy", audioCodec: "copy" },
    }),
  },
  {
    id: "fast-remux",
    label: "Copy streams without re-encoding (fast remux)",
    summary: "Repackages both streams untouched — e.g. .mkv to .mp4 — with no quality loss and near-instant processing.",
    apply: (spec) => ({ ...spec, flags: { ...spec.flags, videoCodec: "copy", audioCodec: "copy" } }),
  },
];

export function getPreset(id: string): Preset<FfmpegSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
