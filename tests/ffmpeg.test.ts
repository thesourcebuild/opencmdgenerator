import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, getPreset, lint, renderOneLine, type FfmpegSpec } from "@cmdgen/ffmpeg";
import { describeSpec } from "@cmdgen/ffmpeg";

const line = (s: FfmpegSpec) => renderOneLine(buildArgv(s), { shell: s.shell });

const spec = (partial: Partial<FfmpegSpec> = {}): FfmpegSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

const codes = (s: FfmpegSpec) => lint(s).diagnostics.map((d) => d.code);

describe("argv shape and ordering", () => {
  it("renders a simple convert: -i <input> ... <output>, output last", () => {
    expect(line(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4" }))).toBe("ffmpeg -i in.mp4 out.mp4");
  });

  it("preserves input order for multiple -i entries", () => {
    expect(line(spec({ inputFiles: ["a.mp4", "b.mp4"], outputFile: "out.mp4" }))).toBe(
      "ffmpeg -i a.mp4 -i b.mp4 out.mp4",
    );
  });

  it("drops blank input entries", () => {
    expect(line(spec({ inputFiles: ["", "in.mp4", "   "], outputFile: "out.mp4" }))).toBe(
      "ffmpeg -i in.mp4 out.mp4",
    );
  });

  it("omits the output entirely when unset, rather than inventing one", () => {
    expect(line(spec({ inputFiles: ["in.mp4"], outputFile: "" }))).toBe("ffmpeg -i in.mp4");
  });

  it("places -y before the first -i — it is a global option", () => {
    expect(line(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { overwrite: true } }))).toBe(
      "ffmpeg -y -i in.mp4 out.mp4",
    );
  });

  it("places -n before the first -i too", () => {
    expect(line(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { noOverwrite: true } }))).toBe(
      "ffmpeg -n -i in.mp4 out.mp4",
    );
  });

  it("places output-related flags after the last -i and before the output file", () => {
    expect(
      line(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { videoCodec: "libx264" } })),
    ).toBe("ffmpeg -i in.mp4 -c:v libx264 out.mp4");
  });

  it("keeps output flags in stable catalogue order, regardless of the order they were set in the spec", () => {
    expect(
      line(
        spec({
          inputFiles: ["in.mp4"],
          outputFile: "out.mp4",
          flags: { audioCodec: "aac", videoCodec: "libx264" },
        }),
      ),
    ).toBe("ffmpeg -i in.mp4 -c:v libx264 -c:a aac out.mp4");
  });

  it("quotes an input path containing a space", () => {
    expect(line(spec({ inputFiles: ["my input.mp4"], outputFile: "out.mp4" }))).toBe(
      "ffmpeg -i 'my input.mp4' out.mp4",
    );
  });

  it("quotes for PowerShell when that shell is selected — quoting only, never which flags appear", () => {
    const base: Partial<FfmpegSpec> = { inputFiles: ["my input.mp4"], outputFile: "out.mp4" };
    const posix = line(spec({ ...base, shell: "posix" }));
    const pwsh = line(spec({ ...base, shell: "powershell" }));
    expect(posix).toBe("ffmpeg -i 'my input.mp4' out.mp4");
    expect(pwsh).toBe("ffmpeg -i 'my input.mp4' out.mp4");
  });
});

describe("video and audio flags", () => {
  it("renders every video option in catalogue order", () => {
    const s = spec({
      inputFiles: ["in.mp4"],
      outputFile: "out.mp4",
      flags: {
        videoCodec: "libx264",
        videoBitrate: "2M",
        resolution: "1280x720",
        frameRate: "30",
        preset: "medium",
        crf: 23,
        pixelFormat: "yuv420p",
      },
    });
    expect(line(s)).toBe(
      "ffmpeg -i in.mp4 -c:v libx264 -b:v 2M -s 1280x720 -r 30 -preset medium -crf 23 -pix_fmt yuv420p out.mp4",
    );
  });

  it("renders every audio option in catalogue order, after the video options", () => {
    const s = spec({
      inputFiles: ["in.mp4"],
      outputFile: "out.mp4",
      flags: { videoCodec: "libx264", audioCodec: "aac", audioBitrate: "128k" },
    });
    expect(line(s)).toBe("ffmpeg -i in.mp4 -c:v libx264 -c:a aac -b:a 128k out.mp4");
  });

  it("-vn and -an render as bare boolean flags", () => {
    expect(line(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { noVideo: true } }))).toBe(
      "ffmpeg -i in.mp4 -vn out.mp4",
    );
    expect(line(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { noAudio: true } }))).toBe(
      "ffmpeg -i in.mp4 -an out.mp4",
    );
  });

  it("an untouched -preset dropdown ('none') is not treated as a set flag", () => {
    const s = spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { preset: "none" } });
    expect(line(s)).toBe("ffmpeg -i in.mp4 out.mp4");
    expect(codes(s)).not.toContain("FFM009");
  });

  it("renders -ss and -t together for a trim, in that order", () => {
    const s = spec({
      inputFiles: ["in.mp4"],
      outputFile: "out.mp4",
      flags: { startTime: "00:00:10", duration: "00:00:30" },
    });
    expect(line(s)).toBe("ffmpeg -i in.mp4 -ss 00:00:10 -t 00:00:30 out.mp4");
  });

  it("renders the full flag set together in one stable order", () => {
    const s = spec({
      inputFiles: ["in.mp4"],
      outputFile: "out.mp4",
      flags: {
        videoCodec: "libx264",
        videoBitrate: "2M",
        resolution: "1280x720",
        frameRate: "30",
        preset: "medium",
        crf: 23,
        pixelFormat: "yuv420p",
        audioCodec: "aac",
        audioBitrate: "128k",
        startTime: "00:00:10",
        duration: "00:00:30",
      },
    });
    expect(line(s)).toBe(
      "ffmpeg -i in.mp4 -c:v libx264 -b:v 2M -s 1280x720 -r 30 -preset medium -crf 23 -pix_fmt yuv420p " +
        "-c:a aac -b:a 128k -ss 00:00:10 -t 00:00:30 out.mp4",
    );
  });
});

describe("lint — safety and correctness", () => {
  it("FFM001 fires with no input files", () => {
    expect(codes(spec({ outputFile: "out.mp4" }))).toContain("FFM001");
    expect(codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4" }))).not.toContain("FFM001");
  });

  it("FFM002 fires with no output file", () => {
    expect(codes(spec({ inputFiles: ["in.mp4"] }))).toContain("FFM002");
    expect(codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4" }))).not.toContain("FFM002");
  });

  it("FFM003 fires when -an and -vn are both set — an invalid, streamless output", () => {
    const s = spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { noAudio: true, noVideo: true } });
    expect(codes(s)).toContain("FFM003");
  });

  it("FFM004 fires when -y and -n contradict, and its fix keeps exactly one", () => {
    const s = spec({
      inputFiles: ["in.mp4"],
      outputFile: "out.mp4",
      flags: { overwrite: true, noOverwrite: true },
    });
    expect(codes(s)).toContain("FFM004");
    const fix = lint(s).diagnostics.find((d) => d.code === "FFM004")!.fix!;
    const fixed = fix.apply(s);
    expect(codes(fixed)).not.toContain("FFM004");
    // Exactly one of the pair survives the fix.
    expect([fixed.flags.overwrite, fixed.flags.noOverwrite].filter(Boolean)).toHaveLength(1);
  });

  it("FFM005 (info) suggests picking -y or -n when neither is set", () => {
    expect(codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4" }))).toContain("FFM005");
    expect(
      codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { overwrite: true } })),
    ).not.toContain("FFM005");
    expect(
      codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { noOverwrite: true } })),
    ).not.toContain("FFM005");
    // No output at all is already covered by FFM002 — do not also pile on FFM005.
    expect(codes(spec({ inputFiles: ["in.mp4"] }))).not.toContain("FFM005");
  });

  it("FFM006 is a caution-level advisory on -y specifically, not a blanket destructive claim", () => {
    const s = spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { overwrite: true } });
    const diag = lint(s).diagnostics.find((d) => d.code === "FFM006")!;
    expect(diag.level).toBe("warning");
    expect(lint(s).isDestructive).toBe(false);
  });

  it("FFM007 warns that -c:v copy makes re-encode options no-ops", () => {
    const s = spec({
      inputFiles: ["in.mp4"],
      outputFile: "out.mp4",
      flags: { videoCodec: "copy", crf: 23, preset: "medium" },
    });
    expect(codes(s)).toContain("FFM007");
    expect(codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { videoCodec: "copy" } }))).not.toContain(
      "FFM007",
    );
  });

  it("FFM008 warns that -c:a copy makes -b:a a no-op", () => {
    const s = spec({
      inputFiles: ["in.mp4"],
      outputFile: "out.mp4",
      flags: { audioCodec: "copy", audioBitrate: "128k" },
    });
    expect(codes(s)).toContain("FFM008");
  });

  it("FFM009 warns when -preset is set for a non-x264/x265 codec", () => {
    expect(
      codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { preset: "medium", videoCodec: "libvpx-vp9" } })),
    ).toContain("FFM009");
    expect(
      codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { preset: "medium", videoCodec: "libx264" } })),
    ).not.toContain("FFM009");
    expect(
      codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { preset: "medium", videoCodec: "libx265" } })),
    ).not.toContain("FFM009");
    // No codec named at all — nothing concrete to contradict, so stay quiet.
    expect(codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { preset: "medium" } }))).not.toContain(
      "FFM009",
    );
    // Already covered, more specifically, by FFM007.
    expect(
      codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { preset: "medium", videoCodec: "copy" } })),
    ).not.toContain("FFM009");
  });

  it("FFM010 warns that -vn makes video options no-ops", () => {
    const s = spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { noVideo: true, crf: 23 } });
    expect(codes(s)).toContain("FFM010");
  });

  it("FFM011 warns that -an makes audio options no-ops", () => {
    const s = spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { noAudio: true, audioBitrate: "128k" } });
    expect(codes(s)).toContain("FFM011");
  });

  it("FFM012 warns when -crf is outside 0-51", () => {
    expect(codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { crf: 60 } }))).toContain("FFM012");
    expect(codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { crf: -1 } }))).toContain("FFM012");
    expect(codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { crf: 0 } }))).not.toContain("FFM012");
    expect(codes(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { crf: 51 } }))).not.toContain("FFM012");
  });

  it("FFM013 warns when -crf and -b:v are both set", () => {
    const s = spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { crf: 23, videoBitrate: "2M" } });
    expect(codes(s)).toContain("FFM013");
  });

  it("a straightforward, unambiguous convert has nothing left to flag", () => {
    const s = spec({
      inputFiles: ["in.mp4"],
      outputFile: "out.mp4",
      flags: { noOverwrite: true, videoCodec: "libx264", audioCodec: "aac" },
    });
    expect(lint(s).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  const withPaths = (partial: Partial<FfmpegSpec> = {}) =>
    spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", ...partial });

  it("'Convert to MP4 (H.264/AAC)'", () => {
    const s = getPreset("convert-mp4")!.apply(withPaths());
    expect(line(s)).toBe("ffmpeg -i in.mp4 -c:v libx264 -c:a aac out.mp4");
  });

  it("'Extract audio only' drops video and stream-copies audio", () => {
    const s = getPreset("extract-audio")!.apply(withPaths());
    expect(line(s)).toBe("ffmpeg -i in.mp4 -vn -c:a copy out.mp4");
  });

  it("'Compress for web (CRF)'", () => {
    const s = getPreset("compress-web-crf")!.apply(withPaths());
    expect(line(s)).toBe("ffmpeg -i in.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac out.mp4");
    // Internally consistent: preset matches an x264 codec, no stray FFM009.
    expect(codes(s)).not.toContain("FFM009");
  });

  it("'Resize video'", () => {
    const s = getPreset("resize-video")!.apply(withPaths());
    expect(line(s)).toBe("ffmpeg -i in.mp4 -c:v libx264 -s 1280x720 out.mp4");
  });

  it("'Trim a clip (start + duration)' uses a fast stream-copy trim", () => {
    const s = getPreset("trim-clip")!.apply(withPaths());
    expect(line(s)).toBe("ffmpeg -i in.mp4 -c:v copy -c:a copy -ss 00:00:10 -t 00:00:30 out.mp4");
    // Stream copy + trim only — no re-encode options set, so FFM007/FFM008 stay quiet.
    expect(codes(s)).not.toContain("FFM007");
    expect(codes(s)).not.toContain("FFM008");
  });

  it("'Copy streams without re-encoding (fast remux)'", () => {
    const s = getPreset("fast-remux")!.apply(withPaths());
    expect(line(s)).toBe("ffmpeg -i in.mp4 -c:v copy -c:a copy out.mp4");
  });

  it("presets apply on top of whatever the user already entered", () => {
    const base = withPaths({ flags: { noOverwrite: true } });
    const s = getPreset("convert-mp4")!.apply(base);
    expect(s.flags.noOverwrite).toBe(true);
    expect(s.flags.videoCodec).toBe("libx264");
  });
});

describe("describeSpec", () => {
  it("describes a bare convert", () => {
    expect(describeSpec(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4" }))).toBe(
      'Convert "in.mp4" into "out.mp4".',
    );
  });

  it("counts multiple inputs instead of naming them all", () => {
    expect(describeSpec(spec({ inputFiles: ["a.mp4", "b.mp4"], outputFile: "out.mp4" }))).toContain("2 inputs");
  });

  it("calls out missing inputs and output as unmistakably wrong", () => {
    expect(describeSpec(spec())).toContain("NOTHING (no inputs set)");
    expect(describeSpec(spec({ inputFiles: ["in.mp4"] }))).toContain("NO OUTPUT FILE");
  });

  it("describes codec choices, distinguishing copy from real encoding", () => {
    const encoded = describeSpec(
      spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { videoCodec: "libx264", audioCodec: "aac" } }),
    );
    expect(encoded).toContain("encoding video with libx264");
    expect(encoded).toContain("encoding audio with aac");

    const copied = describeSpec(
      spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { videoCodec: "copy", audioCodec: "copy" } }),
    );
    expect(copied).toContain("copying the video stream unchanged");
    expect(copied).toContain("copying the audio stream unchanged");
  });

  it("flags dropping both streams as invalid", () => {
    expect(
      describeSpec(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { noVideo: true, noAudio: true } })),
    ).toContain("BOTH audio and video");
  });

  it("describes trimming and overwrite behavior", () => {
    const trimmed = describeSpec(
      spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { startTime: "00:00:10", duration: "00:00:30" } }),
    );
    expect(trimmed).toContain("trimmed to 00:00:30 starting at 00:00:10");

    expect(
      describeSpec(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { overwrite: true } })),
    ).toContain("overwriting an existing output file without asking");
    expect(
      describeSpec(spec({ inputFiles: ["in.mp4"], outputFile: "out.mp4", flags: { noOverwrite: true } })),
    ).toContain("refusing to overwrite an existing output file");
  });
});
