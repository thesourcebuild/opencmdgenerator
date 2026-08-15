import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ViSpec } from "@cmdgen/vi";

const line = (spec: ViSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<ViSpec> = {}): ViSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["notes.txt"],
  ...partial,
});

describe("files, start line, and flags", () => {
  it("a bare file with no flags", () => {
    expect(line(spec())).toBe("vi notes.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("vi a.txt b.txt");
  });

  it("renders -R", () => {
    expect(line(spec({ flags: { readonly: true } }))).toBe("vi -R notes.txt");
  });

  it("renders +<n> before the file, after any flags", () => {
    expect(line(spec({ startLine: 42 }))).toBe("vi +42 notes.txt");
    expect(line(spec({ startLine: 42, flags: { readonly: true } }))).toBe("vi -R +42 notes.txt");
  });

  it("omits +<n> when startLine is unset or zero/negative", () => {
    expect(line(spec({ startLine: undefined }))).toBe("vi notes.txt");
    expect(line(spec({ startLine: 0 }))).toBe("vi notes.txt");
    expect(line(spec({ startLine: -3 }))).toBe("vi notes.txt");
  });

  it("skips blank file entries", () => {
    expect(line(spec({ files: ["", "notes.txt", "  "] }))).toBe("vi notes.txt");
  });
});

describe("lint", () => {
  it("VI001 notes an unnamed buffer when no files are given", () => {
    const result = lint(spec({ files: [] }));
    expect(result.diagnostics.map((d) => d.code)).toContain("VI001");
    expect(result.diagnostics.find((d) => d.code === "VI001")!.level).toBe("info");
  });

  it("VI002 warns about a non-positive start line and the fix clears it", () => {
    const s = spec({ startLine: 0 });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("VI002");
    const fix = result.diagnostics.find((d) => d.code === "VI002")!.fix!;
    expect(fix.apply(s).startLine).toBeUndefined();
  });

  it("a plain vi with a file has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Edit a file' is a bare vi", () => {
    expect(line(getPreset("edit-a-file")!.apply(spec()))).toBe("vi notes.txt");
  });

  it("'View read-only' is -R", () => {
    expect(line(getPreset("view-read-only")!.apply(spec()))).toBe("vi -R notes.txt");
  });

  it("'Open at a specific line' sets +42", () => {
    expect(line(getPreset("open-at-line")!.apply(spec()))).toBe("vi +42 notes.txt");
  });
});

describe("describeSpec", () => {
  it("describes a plain edit", () => {
    expect(describeSpec(spec())).toBe("Open notes.txt in vi.");
  });

  it("describes an unnamed buffer", () => {
    expect(describeSpec(spec({ files: [] }))).toBe("Open an unnamed buffer in vi.");
  });

  it("describes read-only mode and a start line together", () => {
    expect(describeSpec(spec({ startLine: 10, flags: { readonly: true } }))).toBe(
      "Open notes.txt in vi, in read-only mode, starting at line 10.",
    );
  });
});
