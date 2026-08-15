import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type DuSpec } from "@cmdgen/du";

const line = (spec: DuSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<DuSpec> = {}): DuSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("paths and flags", () => {
  it("a bare du with no paths reports on the current directory", () => {
    expect(line(spec())).toBe("du");
  });

  it("lists multiple paths in order", () => {
    expect(line(spec({ paths: ["/var/log", "/home"] }))).toBe("du /var/log /home");
  });

  it("renders -h, -s, -a, -c", () => {
    expect(line(spec({ flags: { humanReadable: true } }))).toBe("du -h");
    expect(line(spec({ flags: { summarize: true } }))).toBe("du -s");
    expect(line(spec({ flags: { all: true } }))).toBe("du -a");
    expect(line(spec({ flags: { total: true } }))).toBe("du -c");
  });

  it("renders --max-depth attached with '='", () => {
    expect(line(spec({ flags: { maxDepth: 1 } }))).toBe("du --max-depth=1");
  });

  it("renders flags before paths", () => {
    expect(line(spec({ paths: ["/var/log"], flags: { humanReadable: true } }))).toBe("du -h /var/log");
  });
});

describe("lint", () => {
  it("DU001 catches --summarize combined with --max-depth", () => {
    const s = spec({ flags: { summarize: true, maxDepth: 2 } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("DU001");
    const diag = result.diagnostics.find((d) => d.code === "DU001")!;
    expect(diag.level).toBe("warning");
    const fix = diag.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("DU001");
  });

  it("a plain du with flags but no conflict has no diagnostics", () => {
    expect(lint(spec({ flags: { humanReadable: true, summarize: true } })).diagnostics).toEqual([]);
  });

  it("empty paths has no diagnostics — bare du on the current directory is valid", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ paths: [] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Human-readable total' is -h -s", () => {
    expect(line(getPreset("human-readable-total")!.apply(spec()))).toBe("du -h -s /var/log");
  });

  it("'One level of subdirectories' is -h --max-depth=1", () => {
    expect(line(getPreset("one-level-deep")!.apply(spec()))).toBe("du -h --max-depth=1 /home");
  });

  it("'Grand total across paths' is -h -c", () => {
    expect(line(getPreset("grand-total")!.apply(spec()))).toBe("du -h -c /var /home");
  });

  it("'Every file, not just directories' is -h -a", () => {
    expect(line(getPreset("every-file")!.apply(spec()))).toBe("du -h -a /var/log");
  });
});

describe("describeSpec", () => {
  it("describes the default case with no paths", () => {
    expect(describeSpec(spec())).toBe("Report disk usage for the current directory.");
  });

  it("describes explicit paths", () => {
    expect(describeSpec(spec({ paths: ["/var/log", "/home"] }))).toBe("Report disk usage for /var/log, /home.");
  });

  it("mentions human-readable units, summarize, all, max-depth, and total as trailing clauses", () => {
    expect(describeSpec(spec({ flags: { humanReadable: true } }))).toBe(
      "Report disk usage for the current directory, using human-readable units.",
    );
    expect(describeSpec(spec({ flags: { summarize: true } }))).toBe(
      "Report disk usage for the current directory, showing only a total for each argument.",
    );
    expect(describeSpec(spec({ flags: { all: true } }))).toBe(
      "Report disk usage for the current directory, including individual files, not just directories.",
    );
    expect(describeSpec(spec({ flags: { maxDepth: 1 } }))).toBe(
      "Report disk usage for the current directory, limited to 1 directory deep.",
    );
    expect(describeSpec(spec({ flags: { maxDepth: 2 } }))).toBe(
      "Report disk usage for the current directory, limited to 2 directories deep.",
    );
    expect(describeSpec(spec({ flags: { total: true } }))).toBe(
      "Report disk usage for the current directory, printing a grand total at the end.",
    );
  });
});
