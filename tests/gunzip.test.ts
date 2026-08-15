import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type GunzipSpec } from "@cmdgen/gunzip";

const line = (spec: GunzipSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<GunzipSpec> = {}): GunzipSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("files and flags", () => {
  it("a bare gunzip with no files renders just the binary", () => {
    expect(line(spec())).toBe("gunzip");
  });

  it("renders files in order", () => {
    expect(line(spec({ files: ["a.txt.gz", "b.txt.gz"] }))).toBe("gunzip a.txt.gz b.txt.gz");
  });

  it("renders -k, -f, -l as bare boolean flags", () => {
    expect(line(spec({ flags: { keep: true } }))).toBe("gunzip -k");
    expect(line(spec({ flags: { force: true } }))).toBe("gunzip -f");
    expect(line(spec({ flags: { list: true } }))).toBe("gunzip -l");
  });

  it("renders flags before files, in catalogue order", () => {
    expect(line(spec({ files: ["a.txt.gz"], flags: { keep: true, force: true } }))).toBe(
      "gunzip -k -f a.txt.gz",
    );
  });
});

describe("lint", () => {
  it("GUZ001 fires when -k is not set and there are files, and its fix adds -k", () => {
    const s = spec({ files: ["a.txt.gz"] });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("GUZ001");
    const diag = result.diagnostics.find((d) => d.code === "GUZ001")!;
    expect(diag.level).toBe("destructive");
    const fixed = diag.fix!.apply(s);
    expect(fixed.flags.keep).toBe(true);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("GUZ001");
  });

  it("GUZ001 does not fire once -k is set", () => {
    expect(lint(spec({ files: ["a.txt.gz"], flags: { keep: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "GUZ001",
    );
  });

  it("GUZ001 does not fire when -l is set — nothing is decompressed", () => {
    expect(lint(spec({ files: ["a.txt.gz"], flags: { list: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "GUZ001",
    );
  });

  it("GUZ001 does not fire with no files — nothing on disk is at risk", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).not.toContain("GUZ001");
  });

  it("GUZ002 fires when -k is set together with -l, and its fix clears -k", () => {
    const s = spec({ files: ["a.txt.gz"], flags: { keep: true, list: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("GUZ002");
    const diag = result.diagnostics.find((d) => d.code === "GUZ002")!;
    expect(diag.level).toBe("warning");
    const fixed = diag.fix!.apply(s);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("GUZ002");
  });

  it("a valid spec with -k alone has no diagnostics", () => {
    expect(lint(spec({ files: ["a.txt.gz"], flags: { keep: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Decompress (default)' has no flags", () => {
    expect(line(getPreset("decompress-remove-archive")!.apply(spec()))).toBe("gunzip notes.txt.gz");
  });

  it("'Decompress, keeping the archive' is -k", () => {
    expect(line(getPreset("decompress-keep-archive")!.apply(spec()))).toBe("gunzip -k notes.txt.gz");
  });

  it("'List contents without decompressing' is -l", () => {
    expect(line(getPreset("list-contents")!.apply(spec()))).toBe("gunzip -l notes.txt.gz");
  });

  it("'Force decompress, keeping the archive' is -f -k", () => {
    expect(line(getPreset("force-decompress-keep-archive")!.apply(spec()))).toBe("gunzip -k -f notes.txt.gz");
  });
});

describe("describeSpec", () => {
  it("describes the default decompress case with a placeholder when files are empty", () => {
    expect(describeSpec(spec())).toBe("Decompress SOME_FILES.");
  });

  it("describes explicit files", () => {
    expect(describeSpec(spec({ files: ["a.txt.gz"] }))).toBe("Decompress a.txt.gz.");
  });

  it("switches the verb to a listing when -l is set", () => {
    expect(describeSpec(spec({ files: ["a.txt.gz"], flags: { list: true } }))).toBe(
      "List the contents of a.txt.gz without decompressing.",
    );
  });

  it("mentions force and keep as trailing clauses", () => {
    const base = { files: ["a.txt.gz"] };
    expect(describeSpec(spec({ ...base, flags: { force: true } }))).toBe(
      "Decompress a.txt.gz, forcing overwrite of any existing output.",
    );
    expect(describeSpec(spec({ ...base, flags: { keep: true } }))).toBe(
      "Decompress a.txt.gz, keeping the .gz file afterward.",
    );
  });
});
