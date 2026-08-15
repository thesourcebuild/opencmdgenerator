import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type WhatisSpec } from "@cmdgen/whatis";

const line = (spec: WhatisSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<WhatisSpec> = {}): WhatisSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("word and flags", () => {
  it("a bare word with no flags", () => {
    expect(line(spec({ word: "ls" }))).toBe("whatis ls");
  });

  it("renders -r, -w, -i, -l", () => {
    expect(line(spec({ word: "ls", flags: { regex: true } }))).toBe("whatis -r ls");
    expect(line(spec({ word: "ls*", flags: { wildcard: true } }))).toBe("whatis -w 'ls*'");
    expect(line(spec({ word: "LS", flags: { caseInsensitive: true } }))).toBe("whatis -i LS");
    expect(line(spec({ word: "ls", flags: { long: true } }))).toBe("whatis -l ls");
  });

  it("combines multiple flags with the word last", () => {
    expect(line(spec({ word: "LS", flags: { caseInsensitive: true, long: true } }))).toBe("whatis -i -l LS");
  });
});

describe("lint", () => {
  it("WHATIS001 catches no word", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("WHATIS001");
  });

  it("WHATIS001 also catches a whitespace-only word", () => {
    expect(lint(spec({ word: "   " })).diagnostics.map((d) => d.code)).toContain("WHATIS001");
  });

  it("WHATIS002 catches regex and wildcard both set", () => {
    expect(lint(spec({ word: "ls", flags: { regex: true, wildcard: true } })).diagnostics.map((d) => d.code)).toContain(
      "WHATIS002",
    );
  });

  it("WHATIS002's fix removes the second flag", () => {
    const withConflict = spec({ word: "ls", flags: { regex: true, wildcard: true } });
    const diagnostic = lint(withConflict).diagnostics.find((d) => d.code === "WHATIS002");
    expect(diagnostic?.fix).toBeDefined();
    const fixed = diagnostic!.fix!.apply(withConflict);
    expect(fixed.flags).toEqual({ regex: true });
  });

  it("a plain whatis has no diagnostics", () => {
    expect(lint(spec({ word: "ls" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Describe a command' is a bare whatis", () => {
    expect(line(getPreset("describe-a-command")!.apply(spec()))).toBe("whatis ls");
  });

  it("'Wildcard search' is -w", () => {
    expect(line(getPreset("wildcard-search")!.apply(spec()))).toBe("whatis -w 'ls*'");
  });

  it("'Case-insensitive lookup' is -i", () => {
    expect(line(getPreset("case-insensitive")!.apply(spec()))).toBe("whatis -i LS");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec({ word: "ls" }))).toBe("Show a one-line description of ls.");
  });

  it("describes an empty word with the SOME_COMMAND placeholder", () => {
    expect(describeSpec(spec())).toBe("Show a one-line description of SOME_COMMAND.");
  });

  it("describes regex, wildcard, case-insensitive, and long as trailing clauses", () => {
    const described = describeSpec(spec({ word: "ls", flags: { regex: true, caseInsensitive: true, long: true } }));
    expect(described).toContain("treating the search term as a regular expression");
    expect(described).toContain("ignoring case when matching");
    expect(described).toContain("without trimming the output to the terminal width");
  });

  it("describes wildcard matching as a trailing clause", () => {
    expect(describeSpec(spec({ word: "ls*", flags: { wildcard: true } }))).toContain(
      "treating the search term as a shell wildcard pattern",
    );
  });
});
