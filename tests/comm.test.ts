import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type CommSpec } from "@cmdgen/comm";

const line = (spec: CommSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<CommSpec> = {}): CommSpec => ({
  ...createSpec({ id: "test-spec" }),
  file1: "sorted-a.txt",
  file2: "sorted-b.txt",
  ...partial,
});

describe("files and flags", () => {
  it("a bare pair of files", () => {
    expect(line(spec())).toBe("comm sorted-a.txt sorted-b.txt");
  });

  it("renders -1, -2, -3, -i, --check-order, --nocheck-order", () => {
    expect(line(spec({ flags: { suppressCol1: true } }))).toBe("comm -1 sorted-a.txt sorted-b.txt");
    expect(line(spec({ flags: { suppressCol2: true } }))).toBe("comm -2 sorted-a.txt sorted-b.txt");
    expect(line(spec({ flags: { suppressCol3: true } }))).toBe("comm -3 sorted-a.txt sorted-b.txt");
    expect(line(spec({ flags: { ignoreCase: true } }))).toBe("comm -i sorted-a.txt sorted-b.txt");
    expect(line(spec({ flags: { checkOrder: true } }))).toBe("comm --check-order sorted-a.txt sorted-b.txt");
    expect(line(spec({ flags: { noCheckOrder: true } }))).toBe("comm --nocheck-order sorted-a.txt sorted-b.txt");
  });

  it("combines -2 and -3 to show only lines unique to file1", () => {
    expect(line(spec({ flags: { suppressCol2: true, suppressCol3: true } }))).toBe(
      "comm -2 -3 sorted-a.txt sorted-b.txt",
    );
  });
});

describe("lint", () => {
  it("COMM001 catches missing file1 and file2, separately", () => {
    expect(lint(spec({ file1: "" })).diagnostics.filter((d) => d.code === "COMM001")).toHaveLength(1);
    expect(lint(spec({ file1: "", file2: "" })).diagnostics.filter((d) => d.code === "COMM001")).toHaveLength(2);
  });

  it("COMM002 catches --check-order and --nocheck-order together", () => {
    const s = spec({ flags: { checkOrder: true, noCheckOrder: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("COMM002");
    const fix = result.diagnostics.find((d) => d.code === "COMM002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("COMM002");
  });

  it("COMM003 warns when -1, -2, and -3 are all set, and the fix removes -3", () => {
    const s = spec({ flags: { suppressCol1: true, suppressCol2: true, suppressCol3: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("COMM003");
    const fix = result.diagnostics.find((d) => d.code === "COMM003")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("COMM003");
  });

  it("a plain comparison has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Show all three columns' is a bare comm", () => {
    expect(line(getPreset("all-three-columns")!.apply(spec()))).toBe("comm sorted-a.txt sorted-b.txt");
  });

  it("'Lines only in file1' is -23", () => {
    expect(line(getPreset("only-in-file1")!.apply(spec()))).toBe("comm -2 -3 sorted-a.txt sorted-b.txt");
  });

  it("'Lines only in file2' is -13", () => {
    expect(line(getPreset("only-in-file2")!.apply(spec()))).toBe("comm -1 -3 sorted-a.txt sorted-b.txt");
  });

  it("'Lines common to both' is -12", () => {
    expect(line(getPreset("common-lines")!.apply(spec()))).toBe("comm -1 -2 sorted-a.txt sorted-b.txt");
  });
});

describe("describeSpec", () => {
  it("describes the default (all three columns) case", () => {
    expect(describeSpec(spec())).toBe(
      "Compare sorted-a.txt and sorted-b.txt (both must already be sorted), printing lines only in sorted-a.txt, lines only in sorted-b.txt, lines common to both.",
    );
  });

  it("describes -23 (only lines unique to file1)", () => {
    expect(describeSpec(spec({ flags: { suppressCol2: true, suppressCol3: true } }))).toBe(
      "Compare sorted-a.txt and sorted-b.txt (both must already be sorted), printing lines only in sorted-a.txt.",
    );
  });

  it("describes suppressing every column", () => {
    expect(
      describeSpec(spec({ flags: { suppressCol1: true, suppressCol2: true, suppressCol3: true } })),
    ).toBe(
      "Compare sorted-a.txt and sorted-b.txt (both must already be sorted), printing nothing — every column is suppressed.",
    );
  });
});
