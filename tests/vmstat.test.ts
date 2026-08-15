import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type VmstatSpec } from "@cmdgen/vmstat";

const line = (spec: VmstatSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<VmstatSpec> = {}): VmstatSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("interval, count, and flags", () => {
  it("a bare vmstat with nothing set renders just the binary", () => {
    expect(line(spec())).toBe("vmstat");
  });

  it("renders -a, -d, -s as bare boolean flags", () => {
    expect(line(spec({ flags: { active: true } }))).toBe("vmstat -a");
    expect(line(spec({ flags: { disk: true } }))).toBe("vmstat -d");
    expect(line(spec({ flags: { stats: true } }))).toBe("vmstat -s");
  });

  it("renders interval alone as a bare positional", () => {
    expect(line(spec({ interval: 2 }))).toBe("vmstat 2");
  });

  it("renders interval then count, in order", () => {
    expect(line(spec({ interval: 2, count: 5 }))).toBe("vmstat 2 5");
  });

  it("does NOT render count without an interval — there is no positional slot for it", () => {
    expect(line(spec({ count: 5 }))).toBe("vmstat");
  });

  it("renders flags before interval/count", () => {
    expect(line(spec({ interval: 2, count: 5, flags: { active: true } }))).toBe("vmstat -a 2 5");
  });
});

describe("lint", () => {
  it("VMS001 catches -d with -s, and its fix removes -s", () => {
    const s = spec({ flags: { disk: true, stats: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("VMS001");
    const diag = result.diagnostics.find((d) => d.code === "VMS001")!;
    expect(diag.level).toBe("warning");
    const fixed = diag.fix!.apply(s);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("VMS001");
  });

  it("-a does not conflict with -d or -s", () => {
    expect(lint(spec({ flags: { active: true, disk: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "VMS001",
    );
    expect(lint(spec({ flags: { active: true, stats: true } })).diagnostics.map((d) => d.code)).not.toContain(
      "VMS001",
    );
  });

  it("VMS002 catches count set without interval, and its fix clears count", () => {
    const s = spec({ count: 5 });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("VMS002");
    const diag = result.diagnostics.find((d) => d.code === "VMS002")!;
    expect(diag.level).toBe("warning");
    expect(diag.field).toBe("count");
    const fixed = diag.fix!.apply(s);
    expect(fixed.count).toBeUndefined();
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("VMS002");
  });

  it("VMS002 does not fire once interval is also set", () => {
    expect(lint(spec({ interval: 2, count: 5 })).diagnostics.map((d) => d.code)).not.toContain("VMS002");
  });

  it("a plain vmstat with no conflicts has no diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ interval: 2, count: 5, flags: { active: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'One-shot snapshot' has no interval, count, or flags", () => {
    expect(line(getPreset("one-shot")!.apply(spec()))).toBe("vmstat");
  });

  it("'Repeat every 2 seconds' is `vmstat 2`", () => {
    expect(line(getPreset("repeat-every-2-seconds")!.apply(spec()))).toBe("vmstat 2");
  });

  it("'Repeat 5 times, every 2 seconds' is `vmstat 2 5`", () => {
    expect(line(getPreset("repeat-with-count")!.apply(spec()))).toBe("vmstat 2 5");
  });

  it("'Disk statistics' is -d", () => {
    expect(line(getPreset("disk-statistics")!.apply(spec()))).toBe("vmstat -d");
  });

  it("'Event counter summary' is -s", () => {
    expect(line(getPreset("event-counter-table")!.apply(spec()))).toBe("vmstat -s");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("Report virtual memory statistics.");
  });

  it("mentions disk, stats, and active as trailing clauses", () => {
    expect(describeSpec(spec({ flags: { disk: true } }))).toBe(
      "Report virtual memory statistics, as a per-disk statistics table.",
    );
    expect(describeSpec(spec({ flags: { stats: true } }))).toBe(
      "Report virtual memory statistics, as a table of event counters and memory statistics.",
    );
    expect(describeSpec(spec({ flags: { active: true } }))).toBe(
      "Report virtual memory statistics, including active/inactive memory.",
    );
  });

  it("mentions interval and count together", () => {
    expect(describeSpec(spec({ interval: 2 }))).toBe("Report virtual memory statistics, repeating every 2 seconds.");
    expect(describeSpec(spec({ interval: 1 }))).toBe("Report virtual memory statistics, repeating every 1 second.");
    expect(describeSpec(spec({ interval: 2, count: 5 }))).toBe(
      "Report virtual memory statistics, repeating every 2 seconds for 5 updates.",
    );
  });
});
