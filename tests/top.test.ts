import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type TopSpec } from "@cmdgen/top";

const line = (spec: TopSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<TopSpec> = {}): TopSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags and argv rendering", () => {
  it("a bare top with no flags", () => {
    expect(line(spec())).toBe("top");
  });

  it("renders -b", () => {
    expect(line(spec({ flags: { batchMode: true } }))).toBe("top -b");
  });

  it("renders -n as a detached text value", () => {
    expect(line(spec({ flags: { iterations: "1" } }))).toBe("top -n 1");
  });

  it("renders -d as a detached text value", () => {
    expect(line(spec({ flags: { delay: "0.5" } }))).toBe("top -d 0.5");
  });

  it("renders -p as a detached text value", () => {
    expect(line(spec({ flags: { pid: "1234" } }))).toBe("top -p 1234");
  });

  it("renders -u as a detached text value", () => {
    expect(line(spec({ flags: { user: "alice" } }))).toBe("top -u alice");
  });

  it("renders -H", () => {
    expect(line(spec({ flags: { threadMode: true } }))).toBe("top -H");
  });

  it("combines -b and -n together", () => {
    expect(line(spec({ flags: { batchMode: true, iterations: "1" } }))).toBe("top -b -n 1");
  });
});

describe("lint", () => {
  it("nothing to flag, ever", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { batchMode: true, pid: "1234", user: "alice" } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Take one batch snapshot' is -b -n 1", () => {
    expect(line(getPreset("batch-snapshot")!.apply(spec()))).toBe("top -b -n 1");
  });

  it("'Watch a single process' is -p 1234", () => {
    expect(line(getPreset("watch-a-process")!.apply(spec()))).toBe("top -p 1234");
  });

  it("'Refresh twice a second' is -d 0.5", () => {
    expect(line(getPreset("fast-refresh")!.apply(spec()))).toBe("top -d 0.5");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("Display an interactively updating list of running processes, sorted by resource usage.");
  });

  it("describes a combination of batch mode, pid, and user", () => {
    const result = describeSpec(spec({ flags: { batchMode: true, iterations: "1", pid: "1234", user: "alice" } }));
    expect(result).toContain("running in batch mode for 1 update(s)");
    expect(result).toContain("limited to process ID(s) 1234");
    expect(result).toContain("limited to processes owned by alice");
  });
});
