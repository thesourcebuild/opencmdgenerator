import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type RmdirSpec } from "@cmdgen/rmdir";

const line = (spec: RmdirSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<RmdirSpec> = {}): RmdirSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("paths and flags", () => {
  it("one path", () => {
    expect(line(spec({ paths: ["olddir"] }))).toBe("rmdir olddir");
  });

  it("lists multiple paths in order", () => {
    expect(line(spec({ paths: ["a", "b"] }))).toBe("rmdir a b");
  });

  it("renders -p and --ignore-fail-on-non-empty", () => {
    expect(line(spec({ paths: ["a/b/c"], flags: { parents: true } }))).toBe("rmdir -p a/b/c");
    expect(line(spec({ paths: ["a"], flags: { ignoreFailOnNonEmpty: true } }))).toBe(
      "rmdir --ignore-fail-on-non-empty a",
    );
  });

  it("trims whitespace from paths", () => {
    expect(line(spec({ paths: ["  olddir  "] }))).toBe("rmdir olddir");
  });
});

describe("lint", () => {
  it("RMD001 catches no paths", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).toContain("RMD001");
  });

  it("a plain removal has no diagnostics", () => {
    expect(lint(spec({ paths: ["olddir"] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Remove an empty directory'", () => {
    expect(line(getPreset("remove-empty-dir")!.apply(spec()))).toBe("rmdir olddir");
  });

  it("'Remove a whole empty directory chain'", () => {
    expect(line(getPreset("remove-empty-chain")!.apply(spec()))).toBe("rmdir -p a/b/c");
  });

  it("'Ignore non-empty failures'", () => {
    expect(line(getPreset("ignore-non-empty-failures")!.apply(spec()))).toBe(
      "rmdir -p --ignore-fail-on-non-empty a/b/c",
    );
  });
});

describe("describeSpec", () => {
  it("describes removing a directory, and always notes rmdir's safety property", () => {
    const description = describeSpec(spec({ paths: ["olddir"] }));
    expect(description).toContain("Remove olddir");
    expect(description).toContain("rmdir only ever removes empty directories");
  });

  it("mentions -p and --ignore-fail-on-non-empty as trailing clauses", () => {
    const description = describeSpec(spec({ paths: ["a/b/c"], flags: { parents: true, ignoreFailOnNonEmpty: true } }));
    expect(description).toContain("and then each now-empty parent directory in turn");
    expect(description).toContain("without erroring if a directory turns out not to be empty");
  });
});
