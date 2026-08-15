import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type CmpSpec } from "@cmdgen/cmp";

const line = (spec: CmpSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<CmpSpec> = {}): CmpSpec => ({
  ...createSpec({ id: "test-spec" }),
  file1: "a.bin",
  file2: "b.bin",
  ...partial,
});

describe("files and flags", () => {
  it("a bare pair of files", () => {
    expect(line(spec())).toBe("cmp a.bin b.bin");
  });

  it("renders -s, -l, -b", () => {
    expect(line(spec({ flags: { silent: true } }))).toBe("cmp -s a.bin b.bin");
    expect(line(spec({ flags: { verbose: true } }))).toBe("cmp -l a.bin b.bin");
    expect(line(spec({ flags: { printBytes: true } }))).toBe("cmp -b a.bin b.bin");
  });

  it("renders --ignore-initial and --bytes attached with =", () => {
    expect(line(spec({ flags: { ignoreInitial: 512 } }))).toBe("cmp --ignore-initial=512 a.bin b.bin");
    expect(line(spec({ flags: { bytesLimit: 1024 } }))).toBe("cmp --bytes=1024 a.bin b.bin");
  });
});

describe("lint", () => {
  it("CMP001 catches missing file1 and file2, separately", () => {
    expect(lint(spec({ file1: "" })).diagnostics.filter((d) => d.code === "CMP001")).toHaveLength(1);
    expect(lint(spec({ file1: "", file2: "" })).diagnostics.filter((d) => d.code === "CMP001")).toHaveLength(2);
  });

  it("CMP002 catches -s and -l together", () => {
    const s = spec({ flags: { silent: true, verbose: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("CMP002");
    const fix = result.diagnostics.find((d) => d.code === "CMP002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CMP002");
  });

  it("a plain comparison has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Compare two files' is a bare cmp", () => {
    expect(line(getPreset("compare-files")!.apply(spec()))).toBe("cmp a.bin b.bin");
  });

  it("'Just check if they differ' is -s", () => {
    expect(line(getPreset("just-check")!.apply(spec()))).toBe("cmp -s a.bin b.bin");
  });

  it("'Show every differing byte' is -l", () => {
    expect(line(getPreset("show-every-difference")!.apply(spec()))).toBe("cmp -l a.bin b.bin");
  });
});

describe("describeSpec", () => {
  it("describes the default (stop-at-first-difference) case", () => {
    expect(describeSpec(spec())).toBe("Compare a.bin and b.bin byte-for-byte, stopping at the first difference.");
  });

  it("describes -s", () => {
    expect(describeSpec(spec({ flags: { silent: true } }))).toBe(
      "Check whether a.bin and b.bin are byte-for-byte identical, printing nothing.",
    );
  });

  it("describes -l", () => {
    expect(describeSpec(spec({ flags: { verbose: true } }))).toBe(
      "Compare a.bin and b.bin byte-for-byte, listing every differing byte.",
    );
  });
});
