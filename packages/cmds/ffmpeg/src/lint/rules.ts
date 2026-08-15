import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { FfmpegSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, flagNumber, flagString, setFlag, validInputFiles } from "../pure";

const X264_FAMILY = new Set(["libx264", "libx265", "libx264rgb"]);

/** Flag ids actually switched on — same "is this flag active" semantics the engine's own `isFlagActive` uses. */
function activeFlagIds(spec: FfmpegSpec): string[] {
  return CATALOGUE.flagsInArgvOrder()
    .filter((f) => {
      const v = spec.flags[f.id];
      if (v === undefined) return false;
      if (f.kind === "boolean") return v === true;
      if (f.kind === "enum") return typeof v === "string" && v !== "" && v !== "none";
      return true;
    })
    .map((f) => f.id);
}

function labelsFor(ids: readonly string[]): string[] {
  return ids.map((id) => flagLabel(CATALOGUE.requireFlag(id)));
}

const noInputs: LintRule<FfmpegSpec> = {
  code: "FFM001",
  check(spec) {
    if (validInputFiles(spec).length > 0) return [];
    return [
      {
        code: "FFM001",
        level: "error",
        message: "Nothing to convert — no input files listed.",
        detail: "Add at least one -i source. As written, ffmpeg has nothing to read.",
        field: "inputFiles",
      },
    ];
  },
};

const noOutput: LintRule<FfmpegSpec> = {
  code: "FFM002",
  check(spec) {
    if (spec.outputFile.trim() !== "") return [];
    return [
      {
        code: "FFM002",
        level: "error",
        message: "No output file set.",
        detail: "ffmpeg's grammar requires exactly one output path as the final argument — without it, there is nowhere for the result to go.",
        field: "outputFile",
      },
    ];
  },
};

const bothStreamsDropped: LintRule<FfmpegSpec> = {
  code: "FFM003",
  check(spec) {
    if (!flagBool(spec, "noAudio") || !flagBool(spec, "noVideo")) return [];
    return [
      {
        code: "FFM003",
        level: "error",
        message: "-an and -vn together drop both audio and video.",
        detail: "With no stream left to write, the output is empty or ffmpeg refuses to produce it at all. Drop one of these.",
        flagIds: ["noAudio", "noVideo"],
      },
    ];
  },
};

/** -y and -n contradict each other — real ffmpeg errors out, or prompts oddly, when both are given. */
const overwriteConflict: LintRule<FfmpegSpec> = {
  code: "FFM004",
  check(spec) {
    const active = activeFlagIds(spec);
    return conflictingPairs(CATALOGUE, active).map(([a, b]): Diagnostic<FfmpegSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "FFM004",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        detail: "ffmpeg rejects (or prompts oddly on) both being set at once — pick at most one.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

/** Real ffmpeg prompts interactively when the output exists and neither -y nor -n is set — a prompt this generator cannot represent. */
const ambiguousOverwrite: LintRule<FfmpegSpec> = {
  code: "FFM005",
  check(spec) {
    if (flagBool(spec, "overwrite") || flagBool(spec, "noOverwrite")) return [];
    if (spec.outputFile.trim() === "") return [];
    return [
      {
        code: "FFM005",
        level: "info",
        message: "Neither -y nor -n is set.",
        detail: "If the output file already exists, real ffmpeg stops and prompts interactively — which cannot be represented here. Pick -y (overwrite) or -n (never overwrite) so the command's behavior is unambiguous wherever it runs.",
        field: "outputFile",
      },
    ];
  },
};

/** -y is not "ffmpeg is destructive" in general — it never touches inputs — just an advisory that the OUTPUT can be silently replaced. */
const overwriteCaution: LintRule<FfmpegSpec> = {
  code: "FFM006",
  check(spec) {
    if (!flagBool(spec, "overwrite")) return [];
    return [
      {
        code: "FFM006",
        level: "warning",
        message: "-y silently overwrites an existing output file.",
        detail: "ffmpeg never touches the input files — but with -y, an existing file at the output path is replaced with no confirmation at all.",
        flagIds: ["overwrite"],
      },
    ];
  },
};

const VIDEO_ENCODE_FLAGS = ["videoBitrate", "resolution", "frameRate", "preset", "crf", "pixelFormat"] as const;

const copyIgnoresVideoOptions: LintRule<FfmpegSpec> = {
  code: "FFM007",
  check(spec) {
    const codec = flagString(spec, "videoCodec");
    if (!codec || codec.trim().toLowerCase() !== "copy") return [];
    const active = activeFlagIds(spec);
    const ignored = VIDEO_ENCODE_FLAGS.filter((id) => active.includes(id));
    if (ignored.length === 0) return [];
    const labels = labelsFor(ignored);
    return [
      {
        code: "FFM007",
        level: "warning",
        message: `-c:v copy stream-copies video, so ${labels.join(", ")} ${ignored.length === 1 ? "has" : "have"} no effect.`,
        detail: "Stream copy remuxes the existing encoded video untouched — any re-encoding option is silently ignored by ffmpeg.",
        flagIds: ["videoCodec", ...ignored],
      },
    ];
  },
};

const copyIgnoresAudioOptions: LintRule<FfmpegSpec> = {
  code: "FFM008",
  check(spec) {
    const codec = flagString(spec, "audioCodec");
    if (!codec || codec.trim().toLowerCase() !== "copy") return [];
    if (!flagString(spec, "audioBitrate")) return [];
    return [
      {
        code: "FFM008",
        level: "warning",
        message: "-c:a copy stream-copies audio, so -b:a has no effect.",
        detail: "A copied audio stream keeps its original bitrate — the requested bitrate is silently ignored.",
        flagIds: ["audioCodec", "audioBitrate"],
      },
    ];
  },
};

const presetNeedsX264Family: LintRule<FfmpegSpec> = {
  code: "FFM009",
  check(spec) {
    if (!activeFlagIds(spec).includes("preset")) return [];
    const codec = flagString(spec, "videoCodec");
    if (!codec) return []; // no codec named at all — nothing concrete to contradict
    const normalized = codec.trim().toLowerCase();
    if (normalized === "copy") return []; // already covered, more specifically, by FFM007
    if (X264_FAMILY.has(normalized)) return [];
    return [
      {
        code: "FFM009",
        level: "warning",
        message: `-preset is x264/x265-specific, but the video codec is "${codec}".`,
        detail: "libx264 and libx265 are the encoders that understand -preset. Most other encoders reject it outright or silently ignore it.",
        flagIds: ["preset", "videoCodec"],
      },
    ];
  },
};

const noVideoWithVideoOptions: LintRule<FfmpegSpec> = {
  code: "FFM010",
  check(spec) {
    if (!flagBool(spec, "noVideo")) return [];
    const active = activeFlagIds(spec);
    const ignored = ["videoCodec", ...VIDEO_ENCODE_FLAGS].filter((id) => active.includes(id));
    if (ignored.length === 0) return [];
    const labels = labelsFor(ignored);
    return [
      {
        code: "FFM010",
        level: "warning",
        message: `-vn drops the video stream, so ${labels.join(", ")} ${ignored.length === 1 ? "has" : "have"} nothing to act on.`,
        flagIds: ["noVideo", ...ignored],
      },
    ];
  },
};

const noAudioWithAudioOptions: LintRule<FfmpegSpec> = {
  code: "FFM011",
  check(spec) {
    if (!flagBool(spec, "noAudio")) return [];
    const active = activeFlagIds(spec);
    const ignored = ["audioCodec", "audioBitrate"].filter((id) => active.includes(id));
    if (ignored.length === 0) return [];
    const labels = labelsFor(ignored);
    return [
      {
        code: "FFM011",
        level: "warning",
        message: `-an drops the audio stream, so ${labels.join(", ")} ${ignored.length === 1 ? "has" : "have"} nothing to act on.`,
        flagIds: ["noAudio", ...ignored],
      },
    ];
  },
};

const crfOutOfRange: LintRule<FfmpegSpec> = {
  code: "FFM012",
  check(spec) {
    const crf = flagNumber(spec, "crf");
    if (crf === undefined || (crf >= 0 && crf <= 51)) return [];
    return [
      {
        code: "FFM012",
        level: "warning",
        message: `-crf ${crf} is outside libx264/libx265's usual 0-51 range.`,
        detail: "0 is lossless, 51 is worst quality. Values outside this range are typically clamped or rejected by the encoder.",
        flagIds: ["crf"],
      },
    ];
  },
};

const crfWithExplicitBitrate: LintRule<FfmpegSpec> = {
  code: "FFM013",
  check(spec) {
    if (flagNumber(spec, "crf") === undefined || !flagString(spec, "videoBitrate")) return [];
    return [
      {
        code: "FFM013",
        level: "warning",
        message: "-crf and -b:v are both set.",
        detail: "-crf targets a constant quality and, on its own, ignores an explicit bitrate target — combining them is usually redundant unless paired with a rate-cap option this scoped subset does not model.",
        flagIds: ["crf", "videoBitrate"],
      },
    ];
  },
};

export const RULES: readonly LintRule<FfmpegSpec>[] = [
  noInputs,
  noOutput,
  bothStreamsDropped,
  overwriteConflict,
  ambiguousOverwrite,
  overwriteCaution,
  copyIgnoresVideoOptions,
  copyIgnoresAudioOptions,
  presetNeedsX264Family,
  noVideoWithVideoOptions,
  noAudioWithAudioOptions,
  crfOutOfRange,
  crfWithExplicitBitrate,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
