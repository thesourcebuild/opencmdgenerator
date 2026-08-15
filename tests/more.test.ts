import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type MoreSpec } from "@cmdgen/more";

const line = (spec: MoreSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<MoreSpec> = {}): MoreSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["notes.txt"],
  ...partial,
});

describe("files, start line, and flags", () => {
  it("a bare file with no flags", () => {
    expect(line(spec())).toBe("more notes.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("more a.txt b.txt");
  });

  it("renders -d and -c", () => {
    expect(line(spec({ flags: { showPrompts: true } }))).toBe("more -d notes.txt");
    expect(line(spec({ flags: { clearScreen: true } }))).toBe("more -c notes.txt");
  });

  it("renders +<n> before the file, after any flags", () => {
    expect(line(spec({ startLine: 42 }))).toBe("more +42 notes.txt");
    expect(line(spec({ startLine: 42, flags: { clearScreen: true } }))).toBe("more -c +42 notes.txt");
  });

  it("omits +<n> when startLine is unset or zero/negative", () => {
    expect(line(spec({ startLine: undefined }))).toBe("more notes.txt");
    expect(line(spec({ startLine: 0 }))).toBe("more notes.txt");
  });

  it("skips blank file entries", () => {
    expect(line(spec({ files: ["", "notes.txt", "  "] }))).toBe("more notes.txt");
  });
});

describe("lint", () => {
  it("MOR001 catches no files", () => {
    expect(lint(spec({ files: [] })).diagnostics.map((d) => d.code)).toContain("MOR001");
  });

  it("MOR002 warns about a non-positive start line and the fix clears it", () => {
    const s = spec({ startLine: -1 });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("MOR002");
    const fix = result.diagnostics.find((d) => d.code === "MOR002")!.fix!;
    expect(fix.apply(s).startLine).toBeUndefined();
  });

  it("a plain more has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Page a file' is a bare more", () => {
    expect(line(getPreset("page-file")!.apply(spec()))).toBe("more notes.txt");
  });

  it("'With helpful prompts' is -d", () => {
    expect(line(getPreset("with-prompts")!.apply(spec()))).toBe("more -d notes.txt");
  });

  it("'Clear screen each page' is -c", () => {
    expect(line(getPreset("clear-each-page")!.apply(spec()))).toBe("more -c notes.txt");
  });

  it("'Open at a specific line' sets +42", () => {
    expect(line(getPreset("open-at-line")!.apply(spec()))).toBe("more +42 notes.txt");
  });
});

describe("describeSpec", () => {
  it("describes a plain page", () => {
    expect(describeSpec(spec())).toBe("Open notes.txt in the more pager.");
  });

  it("describes several flags and a start line together", () => {
    expect(describeSpec(spec({ startLine: 5, flags: { showPrompts: true, clearScreen: true } }))).toBe(
      "Open notes.txt in the more pager, showing helpful prompts, clearing the screen before each page, starting at line 5.",
    );
  });
});
