import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type WcSpec } from "@cmdgen/wc";

const line = (spec: WcSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<WcSpec> = {}): WcSpec => ({
  ...createSpec({ id: "test-spec" }),
  files: ["file.txt"],
  ...partial,
});

describe("argv/render", () => {
  it("a bare file", () => {
    expect(line(spec())).toBe("wc file.txt");
  });

  it("lists multiple files in order", () => {
    expect(line(spec({ files: ["a.txt", "b.txt"] }))).toBe("wc a.txt b.txt");
  });

  it("renders -l, -w, -c, -m", () => {
    expect(line(spec({ flags: { lines: true } }))).toBe("wc -l file.txt");
    expect(line(spec({ flags: { words: true } }))).toBe("wc -w file.txt");
    expect(line(spec({ flags: { bytes: true } }))).toBe("wc -c file.txt");
    expect(line(spec({ flags: { chars: true } }))).toBe("wc -m file.txt");
  });

  it("allows any combination, including all four at once", () => {
    expect(line(spec({ flags: { lines: true, words: true, bytes: true, chars: true } }))).toBe(
      "wc -l -w -c -m file.txt",
    );
  });

  it("reads standard input when no files are given", () => {
    expect(line(spec({ files: [] }))).toBe("wc");
  });
});

describe("lint", () => {
  it("has no rules — every combination is valid", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { lines: true, chars: true, bytes: true } })).diagnostics).toEqual([]);
    expect(lint(spec({ files: [] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Count lines, words, and bytes' is a bare wc", () => {
    expect(line(getPreset("count-everything")!.apply(spec()))).toBe("wc file.txt");
  });

  it("'Count lines only' is -l", () => {
    expect(line(getPreset("count-lines")!.apply(spec()))).toBe("wc -l file.txt");
  });

  it("'Count words only' is -w", () => {
    expect(line(getPreset("count-words")!.apply(spec()))).toBe("wc -w file.txt");
  });

  it("'Count characters only' is -m", () => {
    expect(line(getPreset("count-characters")!.apply(spec()))).toBe("wc -m file.txt");
  });
});

describe("describeSpec", () => {
  it("describes a bare wc as counting all three", () => {
    expect(describeSpec(spec())).toBe("Count lines, words, and bytes in file.txt.");
  });

  it("describes a single selected mode", () => {
    expect(describeSpec(spec({ flags: { lines: true } }))).toBe("Count lines in file.txt.");
  });

  it("describes a combination of modes", () => {
    expect(describeSpec(spec({ flags: { lines: true, chars: true } }))).toBe(
      "Count lines, characters in file.txt.",
    );
  });

  it("falls back to standard input when no files are given", () => {
    expect(describeSpec(spec({ files: [] }))).toBe("Count lines, words, and bytes in standard input.");
  });
});
