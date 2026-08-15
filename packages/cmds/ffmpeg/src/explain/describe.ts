import type { FfmpegSpec } from "../spec";
import { flagBool, flagNumber, flagString, validInputFiles } from "../pure";

/**
 * SCOPE: describes only this package's practical subset of ffmpeg — a
 * single-output transcode/trim/remux — not ffmpeg's full option surface.
 * See spec.ts's header comment.
 */
export function describeSpec(spec: FfmpegSpec): string {
  const inputs = validInputFiles(spec);
  const inputLabel =
    inputs.length === 0 ? "NOTHING (no inputs set)" : inputs.length === 1 ? `"${inputs[0]}"` : `${inputs.length} inputs`;

  const output = spec.outputFile.trim();
  const outputLabel = output === "" ? "an unset output (NO OUTPUT FILE)" : `"${output}"`;

  const parts: string[] = [`Convert ${inputLabel} into ${outputLabel}`];

  const vCodec = flagString(spec, "videoCodec");
  const aCodec = flagString(spec, "audioCodec");
  const noVideo = flagBool(spec, "noVideo");
  const noAudio = flagBool(spec, "noAudio");

  if (noVideo && noAudio) {
    parts.push("dropping BOTH audio and video (invalid — nothing would be left to write)");
  } else {
    if (noVideo) parts.push("dropping the video stream (-vn)");
    else if (vCodec) {
      parts.push(vCodec.trim().toLowerCase() === "copy" ? "copying the video stream unchanged" : `encoding video with ${vCodec}`);
    }

    if (noAudio) parts.push("dropping the audio stream (-an)");
    else if (aCodec) {
      parts.push(aCodec.trim().toLowerCase() === "copy" ? "copying the audio stream unchanged" : `encoding audio with ${aCodec}`);
    }
  }

  const crf = flagNumber(spec, "crf");
  if (crf !== undefined) parts.push(`at CRF ${crf}`);

  const vBitrate = flagString(spec, "videoBitrate");
  if (vBitrate) parts.push(`targeting ${vBitrate} video bitrate`);

  const aBitrate = flagString(spec, "audioBitrate");
  if (aBitrate) parts.push(`targeting ${aBitrate} audio bitrate`);

  const resolution = flagString(spec, "resolution");
  if (resolution) parts.push(`resized to ${resolution}`);

  const frameRate = flagString(spec, "frameRate");
  if (frameRate) parts.push(`at ${frameRate} fps`);

  const start = flagString(spec, "startTime");
  const duration = flagString(spec, "duration");
  if (start && duration) parts.push(`trimmed to ${duration} starting at ${start}`);
  else if (start) parts.push(`starting at ${start}`);
  else if (duration) parts.push(`limited to ${duration}`);

  if (flagBool(spec, "overwrite")) parts.push("overwriting an existing output file without asking");
  else if (flagBool(spec, "noOverwrite")) parts.push("refusing to overwrite an existing output file");

  return `${parts.join(", ")}.`;
}
