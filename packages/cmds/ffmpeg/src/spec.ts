import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * SCOPE: real ffmpeg has literally thousands of options spread across dozens
 * of demuxers, muxers, codecs and filters — its own `-h full` dump runs to
 * thousands of lines. This package deliberately models only a practical,
 * common subset: a single input-list/output transcode, the handful of
 * flags that show up in the overwhelming majority of real-world ffmpeg
 * invocations (codec choice, bitrate, resolution, frame rate, trimming,
 * overwrite behavior), and nothing about filtergraphs, multiple outputs,
 * stream mapping, hardware acceleration, or the hundreds of codec-specific
 * tuning options. Same intentional-scope-limit precedent as this repo's
 * curl and tar packages. See `describeSpec`'s header comment for the same
 * caveat surfaced to the user.
 */
export const FfmpegSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * `-i <file>`, repeated, in order. Real ffmpeg's input order is
   * semantically meaningful — it drives default stream indices, -map,
   * concat, etc. — so this is a plain ordered list rather than a catalogue
   * flag, the same reasoning as tar's `files` / curl's `urls`.
   */
  inputFiles: z.array(z.string()).default([""]),

  /**
   * The single output path. Always the LAST token in the generated argv,
   * per real ffmpeg's grammar (`ffmpeg [global] -i in [in-opts] [out-opts] out`).
   */
  outputFile: z.string().default(""),

  /** Quoting only. ffmpeg is a real executable, invoked identically from bash, cmd and PowerShell — Windows builds ship the same binary. */
  shell: ShellDialect.default("posix"),

  flags: FlagValues.default({}),
});
export type FfmpegSpec = z.infer<typeof FfmpegSpec>;
