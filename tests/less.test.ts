import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type LessSpec } from "@cmdgen/less";

const line = (spec: LessSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<LessSpec> = {}): LessSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["notes.txt"],
  ...partial,
});

describe("files and flags", () => {
  it("a bare file with no flags", () => {
    expect(line(spec())).toBe("less notes.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("less a.txt b.txt");
  });

  it("renders -N, -S, -i, -I, -M, -F, -X, -R, -f", () => {
    expect(line(spec({ flags: { lineNumbers: true } }))).toBe("less -N notes.txt");
    expect(line(spec({ flags: { chopLongLines: true } }))).toBe("less -S notes.txt");
    expect(line(spec({ flags: { ignoreCase: true } }))).toBe("less -i notes.txt");
    expect(line(spec({ flags: { ignoreCaseAlways: true } }))).toBe("less -I notes.txt");
    expect(line(spec({ flags: { longPrompt: true } }))).toBe("less -M notes.txt");
    expect(line(spec({ flags: { quitIfOneScreen: true } }))).toBe("less -F notes.txt");
    expect(line(spec({ flags: { noInit: true } }))).toBe("less -X notes.txt");
    expect(line(spec({ flags: { rawControlChars: true } }))).toBe("less -R notes.txt");
    expect(line(spec({ flags: { force: true } }))).toBe("less -f notes.txt");
  });
});

describe("lint", () => {
  it("LESS001 catches no files", () => {
    expect(lint(spec({ files: [] })).diagnostics.map((d) => d.code)).toContain("LESS001");
  });

  it("LESS002 catches -i and -I together", () => {
    const s = spec({ flags: { ignoreCase: true, ignoreCaseAlways: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("LESS002");
    const fix = result.diagnostics.find((d) => d.code === "LESS002")!.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("LESS002");
  });

  it("a plain less has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Page a file' is a bare less", () => {
    expect(line(getPreset("page-file")!.apply(spec()))).toBe("less notes.txt");
  });

  it("'With line numbers' is -N", () => {
    expect(line(getPreset("with-line-numbers")!.apply(spec()))).toBe("less -N notes.txt");
  });

  it("'Preserve colorized output' is -R", () => {
    expect(line(getPreset("colorized-output")!.apply(spec()))).toBe("less -R notes.txt");
  });
});

describe("describeSpec", () => {
  it("describes a plain page", () => {
    expect(describeSpec(spec())).toBe("Open notes.txt in the less pager.");
  });

  it("describes several flags together", () => {
    expect(describeSpec(spec({ flags: { lineNumbers: true, rawControlChars: true } }))).toBe(
      "Open notes.txt in the less pager, showing line numbers, rendering ANSI color codes as colors.",
    );
  });
});
