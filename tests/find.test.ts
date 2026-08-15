import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type FindSpec } from "@cmdgen/find";

const line = (spec: FindSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<FindSpec> = {}): FindSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("paths and flags", () => {
  it("defaults to the current directory", () => {
    expect(line(spec())).toBe("find .");
  });

  it("falls back to '.' when paths is emptied out entirely", () => {
    expect(line(spec({ paths: [] }))).toBe("find .");
    expect(line(spec({ paths: ["  "] }))).toBe("find .");
  });

  it("multiple search roots", () => {
    expect(line(spec({ paths: ["src", "lib"] }))).toBe("find src lib");
  });

  it("renders -mindepth and -maxdepth as detached number values", () => {
    expect(line(spec({ flags: { mindepth: 1 } }))).toBe("find . -mindepth 1");
    expect(line(spec({ flags: { maxdepth: 3 } }))).toBe("find . -maxdepth 3");
  });

  it("renders -type via its enum's full renders string", () => {
    expect(line(spec({ flags: { type: "f" } }))).toBe("find . -type f");
    expect(line(spec({ flags: { type: "d" } }))).toBe("find . -type d");
    expect(line(spec({ flags: { type: "l" } }))).toBe("find . -type l");
  });

  it("renders -name, -mtime, -size", () => {
    expect(line(spec({ flags: { name: "*.log" } }))).toBe("find . -name '*.log'");
    expect(line(spec({ flags: { mtime: 7 } }))).toBe("find . -mtime 7");
    expect(line(spec({ flags: { size: "+100M" } }))).toBe("find . -size +100M");
  });

  it("renders -delete as a bare flag", () => {
    expect(line(spec({ flags: { delete: true } }))).toBe("find . -delete");
  });

  it("puts filters before -delete, in catalogue order", () => {
    expect(line(spec({ flags: { type: "f", name: "*.tmp", delete: true } }))).toBe(
      "find . -type f -name '*.tmp' -delete",
    );
  });

  it("renders -exec with its command split into words, plus a literal {} and a quoted ;", () => {
    expect(line(spec({ exec: "chmod +x" }))).toBe("find . -exec chmod +x '{}' ';'");
  });

  it("-exec comes after every catalogue flag", () => {
    expect(line(spec({ flags: { type: "f" }, exec: "rm" }))).toBe("find . -type f -exec rm '{}' ';'");
  });
});

describe("lint", () => {
  it("FND001 notes no search root given (falls back to .)", () => {
    expect(lint(spec({ paths: [] })).diagnostics.map((d) => d.code)).toContain("FND001");
  });

  it("a path given has no FND001", () => {
    expect(lint(spec({ paths: ["src"] })).diagnostics.map((d) => d.code)).not.toContain("FND001");
  });

  it("FND002 warns whenever -exec is set", () => {
    expect(lint(spec({ exec: "rm" })).diagnostics.map((d) => d.code)).toContain("FND002");
  });

  it("FND003 is an unconditional advisory whenever -delete is set", () => {
    expect(lint(spec({ flags: { delete: true, name: "*.tmp" } })).diagnostics.map((d) => d.code)).toContain(
      "FND003",
    );
  });

  it("FND004 fires extra-strong when -delete has no -name/-type filter at all", () => {
    expect(lint(spec({ flags: { delete: true } })).diagnostics.map((d) => d.code)).toContain("FND004");
  });

  it("FND004 does not fire once a -name or -type filter is present", () => {
    expect(lint(spec({ flags: { delete: true, name: "*.tmp" } })).diagnostics.map((d) => d.code)).not.toContain(
      "FND004",
    );
    expect(lint(spec({ flags: { delete: true, type: "f" } })).diagnostics.map((d) => d.code)).not.toContain(
      "FND004",
    );
  });

  it("FND005 catches -mindepth greater than -maxdepth", () => {
    expect(lint(spec({ flags: { mindepth: 5, maxdepth: 2 } })).diagnostics.map((d) => d.code)).toContain("FND005");
  });

  it("FND005 does not fire when mindepth <= maxdepth", () => {
    expect(lint(spec({ flags: { mindepth: 1, maxdepth: 3 } })).diagnostics.map((d) => d.code)).not.toContain(
      "FND005",
    );
  });

  it("a plain filtered search has no diagnostics", () => {
    expect(lint(spec({ paths: ["src"], flags: { type: "f", name: "*.ts" } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Find files by name'", () => {
    expect(line(getPreset("find-by-name")!.apply(spec()))).toBe("find . -type f -name '*.log'");
  });

  it("'Find directories only'", () => {
    expect(line(getPreset("find-directories")!.apply(spec()))).toBe("find . -type d");
  });

  it("'Find large files'", () => {
    expect(line(getPreset("find-large-files")!.apply(spec()))).toBe("find . -type f -size +100M");
  });

  it("'Find recently modified files'", () => {
    expect(line(getPreset("find-recently-modified")!.apply(spec()))).toBe("find . -mtime 7");
  });

  it("'Delete matching temp files'", () => {
    expect(line(getPreset("delete-matching-temp-files")!.apply(spec()))).toBe(
      "find . -type f -name '*.tmp' -delete",
    );
  });

  it("'Run a command on every match'", () => {
    expect(line(getPreset("run-command-on-matches")!.apply(spec()))).toBe(
      "find . -type f -name '*.sh' -exec chmod +x '{}' ';'",
    );
  });
});

describe("describeSpec", () => {
  it("describes a plain search of the current directory", () => {
    expect(describeSpec(spec())).toBe("Search ..");
  });

  it("mentions depth, type, name, mtime, and size as trailing clauses", () => {
    const description = describeSpec(
      spec({ paths: ["src"], flags: { mindepth: 1, maxdepth: 3, type: "f", name: "*.ts", mtime: 7, size: "+1M" } }),
    );
    expect(description).toContain("Search src");
    expect(description).toContain("starting at depth 1");
    expect(description).toContain("no deeper than depth 3");
    expect(description).toContain("for regular files");
    expect(description).toContain("named *.ts");
    expect(description).toContain("last modified exactly 7 days ago");
    expect(description).toContain("sized +1M");
  });

  it("mentions -delete and -exec", () => {
    expect(describeSpec(spec({ flags: { delete: true } }))).toContain("deleting every match permanently");
    expect(describeSpec(spec({ exec: "chmod +x" }))).toContain('running "chmod +x" on every match');
  });
});
