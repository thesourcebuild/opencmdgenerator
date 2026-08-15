import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type GzipSpec } from "@cmdgen/gzip";

const line = (spec: GzipSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<GzipSpec> = {}): GzipSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("files, compressionLevel, and flags", () => {
  it("a bare gzip with no files renders just the binary", () => {
    expect(line(spec())).toBe("gzip");
  });

  it("renders files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("gzip a.txt b.txt");
  });

  it("renders -d, -k, -f, -r as bare boolean flags", () => {
    expect(line(spec({ flags: { decompress: true } }))).toBe("gzip -d");
    expect(line(spec({ flags: { keep: true } }))).toBe("gzip -k");
    expect(line(spec({ flags: { force: true } }))).toBe("gzip -f");
    expect(line(spec({ flags: { recursive: true } }))).toBe("gzip -r");
  });

  it("renders the compression level as -N, between the flags and the files", () => {
    expect(line(spec({ compressionLevel: 9, files: ["a.txt"], flags: { keep: true } }))).toBe("gzip -k -9 a.txt");
  });

  it("renders flags before the compression level and files, in catalogue order", () => {
    expect(
      line(spec({ files: ["a.txt"], compressionLevel: 1, flags: { keep: true, recursive: true } })),
    ).toBe("gzip -k -r -1 a.txt");
  });
});

describe("lint", () => {
  it("GZP001 fires when -k is not set and there are files, and its fix adds -k", () => {
    const s = spec({ files: ["a.txt"] });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("GZP001");
    const diag = result.diagnostics.find((d) => d.code === "GZP001")!;
    expect(diag.level).toBe("destructive");
    expect(diag.message).toContain("compressed");
    const fixed = diag.fix!.apply(s);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("GZP001");
    expect(fixed.flags.keep).toBe(true);
  });

  it("GZP001 mentions decompression when -d is set", () => {
    const result = lint(spec({ files: ["a.txt.gz"], flags: { decompress: true } }));
    const diag = result.diagnostics.find((d) => d.code === "GZP001")!;
    expect(diag.message).toContain("decompressed");
  });

  it("GZP001 does not fire once -k is set", () => {
    expect(lint(spec({ files: ["a.txt"], flags: { keep: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "GZP001",
    );
  });

  it("GZP001 does not fire with no files — nothing on disk is at risk", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).not.toContain("GZP001");
  });

  it("GZP002 fires when a compression level is set together with -d, and its fix clears the level", () => {
    const s = spec({ files: ["a.txt.gz"], compressionLevel: 9, flags: { decompress: true, keep: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("GZP002");
    const diag = result.diagnostics.find((d) => d.code === "GZP002")!;
    expect(diag.level).toBe("warning");
    const fixed = diag.fix!.apply(s);
    expect(fixed.compressionLevel).toBeUndefined();
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("GZP002");
  });

  it("a valid spec with -k and no decompress/level conflict has no diagnostics", () => {
    expect(lint(spec({ files: ["a.txt"], flags: { keep: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Compress, keeping the original' is -k", () => {
    expect(line(getPreset("compress-keep-original")!.apply(spec()))).toBe("gzip -k notes.txt");
  });

  it("'Maximum compression, keeping the original' is -k -9", () => {
    expect(line(getPreset("max-compression-keep-original")!.apply(spec()))).toBe("gzip -k -9 access.log");
  });

  it("'Decompress, keeping the archive' is -d -k", () => {
    expect(line(getPreset("decompress-keep-archive")!.apply(spec()))).toBe("gzip -d -k notes.txt.gz");
  });

  it("'Compress a directory recursively' is -k -r", () => {
    expect(line(getPreset("recursive-compress-directory")!.apply(spec()))).toBe("gzip -k -r logs/");
  });
});

describe("describeSpec", () => {
  it("describes the default compress case with a placeholder when files are empty", () => {
    expect(describeSpec(spec())).toBe("Compress SOME_FILES.");
  });

  it("describes explicit files", () => {
    expect(describeSpec(spec({ files: ["a.txt", "b.txt"] }))).toBe("Compress a.txt, b.txt.");
  });

  it("switches the verb to Decompress when -d is set", () => {
    expect(describeSpec(spec({ files: ["a.txt.gz"], flags: { decompress: true } }))).toBe(
      "Decompress a.txt.gz.",
    );
  });

  it("mentions compression level, recursion, force, and keep as trailing clauses", () => {
    const base = { files: ["a.txt"] };
    expect(describeSpec(spec({ ...base, compressionLevel: 9 }))).toBe(
      "Compress a.txt, using compression level 9.",
    );
    expect(describeSpec(spec({ ...base, flags: { recursive: true } }))).toBe(
      "Compress a.txt, recursing into directories.",
    );
    expect(describeSpec(spec({ ...base, flags: { force: true } }))).toBe(
      "Compress a.txt, forcing overwrite of any existing output.",
    );
    expect(describeSpec(spec({ ...base, flags: { keep: true } }))).toBe(
      "Compress a.txt, keeping the original file afterward.",
    );
  });
});
