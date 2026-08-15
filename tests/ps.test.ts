import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type PsSpec } from "@cmdgen/ps";

const line = (spec: PsSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<PsSpec> = {}): PsSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags", () => {
  it("a bare ps with no flags", () => {
    expect(line(spec())).toBe("ps");
  });

  it("renders -e, -a, -x, -f, -u", () => {
    expect(line(spec({ flags: { everyone: true } }))).toBe("ps -e");
    expect(line(spec({ flags: { allWithTty: true } }))).toBe("ps -a");
    expect(line(spec({ flags: { withoutTty: true } }))).toBe("ps -x");
    expect(line(spec({ flags: { fullFormat: true } }))).toBe("ps -f");
    expect(line(spec({ flags: { userFormat: true } }))).toBe("ps -u");
  });

  it("renders --pid detached with its long form", () => {
    expect(line(spec({ flags: { pid: "1234" } }))).toBe("ps --pid 1234");
  });

  it("renders --pid with a comma-separated list", () => {
    expect(line(spec({ flags: { pid: "1234,5678" } }))).toBe("ps --pid 1234,5678");
  });

  it("renders --sort attached with =", () => {
    expect(line(spec({ flags: { sortBy: "-%cpu" } }))).toBe("ps --sort=-%cpu");
  });

  it("renders -o detached with its short form", () => {
    expect(line(spec({ flags: { format: "pid,comm,%cpu" } }))).toBe("ps -o pid,comm,%cpu");
  });

  it("combines selection and format flags in stable order", () => {
    expect(line(spec({ flags: { everyone: true, fullFormat: true } }))).toBe("ps -e -f");
    expect(line(spec({ flags: { allWithTty: true, userFormat: true, withoutTty: true } }))).toBe("ps -a -u -x");
    expect(line(spec({ flags: { everyone: true, format: "pid,comm,%cpu" } }))).toBe("ps -e -o pid,comm,%cpu");
  });
});

describe("lint", () => {
  it("nothing to flag, ever", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { everyone: true, fullFormat: true, pid: "1234" } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'List every process' is -e -f", () => {
    expect(line(getPreset("list-everything")!.apply(spec()))).toBe("ps -e -f");
  });

  it("'Classic \"ps aux\" style' is -a -u -x", () => {
    expect(line(getPreset("bsd-style")!.apply(spec()))).toBe("ps -a -u -x");
  });

  it("'Show only PID, command, and CPU%' is -e -o", () => {
    expect(line(getPreset("custom-columns")!.apply(spec()))).toBe("ps -e -o pid,comm,%cpu");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("List the processes running in the current terminal for the current user.");
  });

  it("describes -e", () => {
    expect(describeSpec(spec({ flags: { everyone: true } }))).toContain("every process on the system");
  });

  it("describes a format combination", () => {
    expect(describeSpec(spec({ flags: { everyone: true, fullFormat: true } }))).toContain("full-format listing");
  });

  it("describes --sort", () => {
    expect(describeSpec(spec({ flags: { sortBy: "-%cpu" } }))).toContain("sorted by -%cpu");
  });
});
