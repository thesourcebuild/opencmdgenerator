import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type AwkSpec } from "@cmdgen/awk";

const line = (spec: AwkSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<AwkSpec> = {}): AwkSpec => ({
  ...createSpec({ id: "test-spec" }),
  program: "{print $1}",
  files: ["notes.txt"],
  ...partial,
});

describe("argv/render", () => {
  it("a bare program and file", () => {
    expect(line(spec())).toBe("awk '{print $1}' notes.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("awk '{print $1}' a.txt b.txt");
  });

  it("renders -F", () => {
    expect(line(spec({ flags: { fieldSeparator: ":" } }))).toBe("awk -F : '{print $1}' notes.txt");
  });

  it("renders --posix", () => {
    expect(line(spec({ flags: { posixMode: true } }))).toBe("awk --posix '{print $1}' notes.txt");
  });

  it("renders -F before --posix, both before -v assignments, before the program", () => {
    expect(
      line(spec({ flags: { fieldSeparator: ":", posixMode: true }, assignments: ["OFS=,", "x=1"] })),
    ).toBe("awk -F : --posix -v OFS=, -v x=1 '{print $1}' notes.txt");
  });

  it("drops blank assignments and blank files", () => {
    expect(line(spec({ assignments: ["", "  ", "x=1"], files: ["", "notes.txt"] }))).toBe(
      "awk -v x=1 '{print $1}' notes.txt",
    );
  });

  it("renders no program token when program is blank", () => {
    expect(line(spec({ program: "" }))).toBe("awk notes.txt");
  });

  it("reads standard input when no files are given", () => {
    expect(line(spec({ files: [] }))).toBe("awk '{print $1}'");
  });
});

describe("lint", () => {
  it("AWK001 catches an empty program", () => {
    expect(lint(spec({ program: "" })).diagnostics.map((d) => d.code)).toContain("AWK001");
  });

  it("AWK001 catches a whitespace-only program", () => {
    expect(lint(spec({ program: "   " })).diagnostics.map((d) => d.code)).toContain("AWK001");
  });

  it("a plain program has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Print a field' splits on : and prints $1", () => {
    expect(line(getPreset("print-a-field")!.apply(spec()))).toBe("awk -F : '{print $1}' /etc/passwd");
  });

  it("'Sum a column' accumulates and prints at END", () => {
    expect(line(getPreset("sum-a-column")!.apply(spec()))).toBe(
      "awk '{sum += $1} END {print sum}' numbers.txt",
    );
  });

  it("'Assign a variable' sets OFS via -v", () => {
    expect(line(getPreset("assign-a-variable")!.apply(spec()))).toBe(
      "awk -v OFS=, '{print $1, $2}' data.txt",
    );
  });

  it("'Filter rows by a condition' is a bare pattern with no action", () => {
    expect(line(getPreset("filter-rows")!.apply(spec()))).toBe("awk '$3 > 100' data.txt");
  });
});

describe("describeSpec", () => {
  it("describes a plain run", () => {
    expect(describeSpec(spec())).toContain('Run the awk program {print $1} over notes.txt');
  });

  it("mentions the field separator when set", () => {
    expect(describeSpec(spec({ flags: { fieldSeparator: ":" } }))).toContain('splitting fields on ":"');
  });

  it("mentions -v assignments when present", () => {
    expect(describeSpec(spec({ assignments: ["OFS=,"] }))).toContain("with OFS=, assigned via -v");
  });

  it("mentions POSIX mode when set", () => {
    expect(describeSpec(spec({ flags: { posixMode: true } }))).toContain("in POSIX-compatible mode");
  });

  it("always includes the scope caveat about the program potentially writing files", () => {
    expect(describeSpec(spec())).toContain("this generator has no way to detect that");
  });

  it("falls back to standard input when no files are given", () => {
    expect(describeSpec(spec({ files: [] }))).toContain("over standard input");
  });
});
