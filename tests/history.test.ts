import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type HistorySpec } from "@cmdgen/history";

const line = (spec: HistorySpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<HistorySpec> = {}): HistorySpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("count and flags", () => {
  it("a bare history with nothing set", () => {
    expect(line(spec())).toBe("history");
  });

  it("renders a bare count with no flag", () => {
    expect(line(spec({ count: 20 }))).toBe("history 20");
  });

  it("renders -c", () => {
    expect(line(spec({ flags: { clear: true } }))).toBe("history -c");
  });

  it("renders -d with its offset", () => {
    expect(line(spec({ flags: { deleteOffset: 42 } }))).toBe("history -d 42");
  });

  it("combines -d with a count", () => {
    expect(line(spec({ count: 5, flags: { deleteOffset: 42 } }))).toBe("history -d 42 5");
  });
});

describe("lint", () => {
  it("HST001 always fires, with no fix, when -c is set", () => {
    const diagnostics = lint(spec({ flags: { clear: true } })).diagnostics;
    const diagnostic = diagnostics.find((d) => d.code === "HST001");
    expect(diagnostic).toBeDefined();
    expect(diagnostic!.level).toBe("destructive");
    expect(diagnostic!.fix).toBeUndefined();
  });

  it("HST001 does not fire without -c", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).not.toContain("HST001");
  });

  it("HST002 catches -c and -d combined", () => {
    expect(lint(spec({ flags: { clear: true, deleteOffset: 42 } })).diagnostics.map((d) => d.code)).toContain(
      "HST002",
    );
  });

  it("HST002's fix removes -d, keeping -c", () => {
    const withConflict = spec({ flags: { clear: true, deleteOffset: 42 } });
    const diagnostic = lint(withConflict).diagnostics.find((d) => d.code === "HST002");
    expect(diagnostic?.fix).toBeDefined();
    const fixed = diagnostic!.fix!.apply(withConflict);
    expect(fixed.flags).toEqual({ clear: true, deleteOffset: undefined });
  });

  it("HST003 catches -c combined with a count", () => {
    expect(lint(spec({ count: 10, flags: { clear: true } })).diagnostics.map((d) => d.code)).toContain("HST003");
  });

  it("HST003's fix removes the count", () => {
    const withCount = spec({ count: 10, flags: { clear: true } });
    const diagnostic = lint(withCount).diagnostics.find((d) => d.code === "HST003");
    expect(diagnostic?.fix).toBeDefined();
    const fixed = diagnostic!.fix!.apply(withCount);
    expect(fixed.count).toBeUndefined();
  });

  it("a plain history with just a count has no diagnostics", () => {
    expect(lint(spec({ count: 10 })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Show last N commands'", () => {
    expect(line(getPreset("show-last-n")!.apply(spec()))).toBe("history 20");
  });

  it("'Clear history'", () => {
    expect(line(getPreset("clear-history")!.apply(spec()))).toBe("history -c");
  });

  it("'Delete one entry'", () => {
    expect(line(getPreset("delete-one-entry")!.apply(spec()))).toBe("history -d 42");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("Show the shell's command history.");
  });

  it("describes a count", () => {
    expect(describeSpec(spec({ count: 20 }))).toBe("Show the last 20 commands from the history list.");
  });

  it("describes -c", () => {
    expect(describeSpec(spec({ flags: { clear: true } }))).toBe(
      "Clear the entire history list for the current session.",
    );
  });

  it("describes -d", () => {
    expect(describeSpec(spec({ flags: { deleteOffset: 42 } }))).toBe("Delete history entry 42.");
  });
});
