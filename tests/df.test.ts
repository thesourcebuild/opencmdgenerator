import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type DfSpec } from "@cmdgen/df";

const line = (spec: DfSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<DfSpec> = {}): DfSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("paths and flags", () => {
  it("a bare df with no paths reports every mounted filesystem", () => {
    expect(line(spec())).toBe("df");
  });

  it("lists multiple paths in order", () => {
    expect(line(spec({ paths: ["/mnt/data", "/home"] }))).toBe("df /mnt/data /home");
  });

  it("renders -h, -H, -T, -i, -a", () => {
    expect(line(spec({ flags: { humanReadable: true } }))).toBe("df -h");
    expect(line(spec({ flags: { siUnits: true } }))).toBe("df -H");
    expect(line(spec({ flags: { showType: true } }))).toBe("df -T");
    expect(line(spec({ flags: { inodes: true } }))).toBe("df -i");
    expect(line(spec({ flags: { allFilesystems: true } }))).toBe("df -a");
  });

  it("renders --total as a long-only flag", () => {
    expect(line(spec({ flags: { total: true } }))).toBe("df --total");
  });

  it("renders flags before paths", () => {
    expect(line(spec({ paths: ["/mnt/data"], flags: { humanReadable: true } }))).toBe("df -h /mnt/data");
  });
});

describe("lint", () => {
  it("DF001 catches -h with -H", () => {
    const s = spec({ flags: { humanReadable: true, siUnits: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("DF001");
    const diag = result.diagnostics.find((d) => d.code === "DF001")!;
    expect(diag.level).toBe("warning");
    const fix = diag.fix!;
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("DF001");
  });

  it("a plain df with flags but no conflict has no diagnostics", () => {
    expect(lint(spec({ flags: { humanReadable: true } })).diagnostics).toEqual([]);
  });

  it("empty paths has no diagnostics — bare df reporting everything is valid, not an error", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ paths: [] })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Human-readable sizes' is -h", () => {
    expect(line(getPreset("human-readable")!.apply(spec()))).toBe("df -h");
  });

  it("'Include pseudo filesystems' is -h -a", () => {
    expect(line(getPreset("include-pseudo-filesystems")!.apply(spec()))).toBe("df -h -a");
  });

  it("'Check inode usage' is -i", () => {
    expect(line(getPreset("inode-usage")!.apply(spec()))).toBe("df -i");
  });
});

describe("describeSpec", () => {
  it("describes the default case with no paths", () => {
    expect(describeSpec(spec())).toBe("Report disk space usage for every mounted filesystem.");
  });

  it("describes explicit paths", () => {
    expect(describeSpec(spec({ paths: ["/mnt/data", "/home"] }))).toBe(
      "Report disk space usage for /mnt/data, /home.",
    );
  });

  it("mentions human-readable units and inode mode as trailing clauses", () => {
    expect(describeSpec(spec({ flags: { humanReadable: true } }))).toBe(
      "Report disk space usage for every mounted filesystem, using human-readable power-of-1024 units.",
    );
    expect(describeSpec(spec({ flags: { inodes: true } }))).toBe(
      "Report disk space usage for every mounted filesystem, reporting inode usage instead of block usage.",
    );
  });
});
