import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type LocateSpec } from "@cmdgen/locate";

const line = (spec: LocateSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<LocateSpec> = {}): LocateSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("pattern and flags", () => {
  it("a bare pattern", () => {
    expect(line(spec({ pattern: "*.conf" }))).toBe("locate '*.conf'");
  });

  it("renders -i, -c, -A", () => {
    expect(line(spec({ pattern: "readme", flags: { ignoreCase: true } }))).toBe("locate -i readme");
    expect(line(spec({ pattern: "*.log", flags: { count: true } }))).toBe("locate -c '*.log'");
    expect(line(spec({ pattern: "foo", flags: { all: true } }))).toBe("locate -A foo");
  });

  it("-r renders bare, with the pattern following as its own token", () => {
    expect(line(spec({ pattern: "^/etc/.*conf$", flags: { regexp: true } }))).toBe("locate -r '^/etc/.*conf$'");
  });

  it("trims whitespace from the pattern", () => {
    expect(line(spec({ pattern: "  readme  " }))).toBe("locate readme");
  });
});

describe("lint", () => {
  it("LOC001 catches no pattern", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("LOC001");
  });

  it("LOC002 always notes the stale-database caveat", () => {
    expect(lint(spec({ pattern: "readme" })).diagnostics.map((d) => d.code)).toContain("LOC002");
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("LOC002");
  });

  it("a plain search has exactly the LOC002 caveat, no error", () => {
    const diagnostics = lint(spec({ pattern: "readme" })).diagnostics;
    expect(diagnostics.map((d) => d.code)).toEqual(["LOC002"]);
  });
});

describe("presets", () => {
  it("'Find files by name'", () => {
    expect(line(getPreset("basic-search")!.apply(spec()))).toBe("locate '*.conf'");
  });

  it("'Case-insensitive search'", () => {
    expect(line(getPreset("case-insensitive")!.apply(spec()))).toBe("locate -i readme");
  });

  it("'Count matches only'", () => {
    expect(line(getPreset("count-matches")!.apply(spec()))).toBe("locate -c '*.log'");
  });

  it("'Regular-expression search'", () => {
    expect(line(getPreset("regex-search")!.apply(spec()))).toBe("locate -r '^/etc/.*\\.conf$'");
  });
});

describe("describeSpec", () => {
  it("describes a plain search", () => {
    expect(describeSpec(spec({ pattern: "readme" }))).toBe("Search the locate database for names matching readme.");
  });

  it("describes a regexp search", () => {
    expect(describeSpec(spec({ pattern: "^/etc", flags: { regexp: true } }))).toBe(
      "Search the locate database for names matching the regular expression ^/etc.",
    );
  });

  it("mentions ignoreCase, count, and all as trailing clauses", () => {
    const description = describeSpec(spec({ pattern: "readme", flags: { ignoreCase: true, count: true, all: true } }));
    expect(description).toContain("ignoring case");
    expect(description).toContain("printing only a count of matches");
    expect(description).toContain("requiring every given pattern to match");
  });
});
