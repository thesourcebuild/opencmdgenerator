import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type ManSpec } from "@cmdgen/man";

const line = (spec: ManSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<ManSpec> = {}): ManSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("page and flags", () => {
  it("a bare page with no flags", () => {
    expect(line(spec({ page: "ls" }))).toBe("man ls");
  });

  it("renders -a, -w, -k, -f", () => {
    expect(line(spec({ page: "ls", flags: { all: true } }))).toBe("man -a ls");
    expect(line(spec({ page: "ls", flags: { whereis: true } }))).toBe("man -w ls");
    expect(line(spec({ page: "copy", flags: { keyword: true } }))).toBe("man -k copy");
    expect(line(spec({ page: "ls", flags: { short: true } }))).toBe("man -f ls");
  });

  it("combines multiple flags with the page last", () => {
    expect(line(spec({ page: "ls", flags: { all: true, whereis: true } }))).toBe("man -a -w ls");
  });
});

describe("lint", () => {
  it("MAN001 catches no page", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("MAN001");
  });

  it("MAN001 also catches a whitespace-only page", () => {
    expect(lint(spec({ page: "   " })).diagnostics.map((d) => d.code)).toContain("MAN001");
  });

  it("a plain man has no diagnostics", () => {
    expect(lint(spec({ page: "ls" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Read a manual page' is a bare man", () => {
    expect(line(getPreset("read-a-page")!.apply(spec()))).toBe("man ls");
  });

  it("'Find where a page lives' is -w", () => {
    expect(line(getPreset("find-the-file")!.apply(spec()))).toBe("man -w ls");
  });

  it("'Search by keyword' is -k", () => {
    expect(line(getPreset("search-by-keyword")!.apply(spec()))).toBe("man -k copy");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ page: "ls" }))).toBe("Display the manual page for ls.");
  });

  it("describes an empty page with the SOME_COMMAND placeholder", () => {
    expect(describeSpec(spec())).toBe("Display the manual page for SOME_COMMAND.");
  });

  it("describes -a, -w, -k, and -f as trailing clauses", () => {
    const described = describeSpec(spec({ page: "ls", flags: { all: true, whereis: true, short: true } }));
    expect(described).toContain("showing all matching pages, not just the first");
    expect(described).toContain("printing the location of the page file instead of displaying it");
    expect(described).toContain("showing a one-line description instead of the full page");
  });

  it("describes keyword mode as a trailing clause", () => {
    expect(describeSpec(spec({ page: "copy", flags: { keyword: true } }))).toContain(
      "treating the given text as a keyword to search for",
    );
  });
});
