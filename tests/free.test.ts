import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type FreeSpec } from "@cmdgen/free";

const line = (spec: FreeSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<FreeSpec> = {}): FreeSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags", () => {
  it("a bare free with no flags renders just the binary", () => {
    expect(line(spec())).toBe("free");
  });

  it("renders -h, -m, -g, -t as bare boolean flags", () => {
    expect(line(spec({ flags: { human: true } }))).toBe("free -h");
    expect(line(spec({ flags: { mega: true } }))).toBe("free -m");
    expect(line(spec({ flags: { giga: true } }))).toBe("free -g");
    expect(line(spec({ flags: { total: true } }))).toBe("free -t");
  });

  it("renders --seconds with its numeric argument as a separate token", () => {
    expect(line(spec({ flags: { seconds: 5 } }))).toBe("free --seconds 5");
  });

  it("renders flags in catalogue order", () => {
    expect(line(spec({ flags: { human: true, total: true } }))).toBe("free -h -t");
  });
});

describe("lint", () => {
  it("FRE001 catches -h with -m, and its fix removes -m", () => {
    const s = spec({ flags: { human: true, mega: true } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("FRE001");
    const diag = result.diagnostics.find((d) => d.code === "FRE001")!;
    expect(diag.level).toBe("warning");
    const fixed = diag.fix!.apply(s);
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("FRE001");
  });

  it("FRE001 catches every pairing among -h, -m, -g", () => {
    expect(lint(spec({ flags: { human: true, giga: true } })).diagnostics.map((d) => d.code)).toContain("FRE001");
    expect(lint(spec({ flags: { mega: true, giga: true } })).diagnostics.map((d) => d.code)).toContain("FRE001");
  });

  it("FRE002 catches a non-positive -s value, and its fix clears -s", () => {
    const s = spec({ flags: { seconds: 0 } });
    const result = lint(s);
    expect(result.diagnostics.map((d) => d.code)).toContain("FRE002");
    const diag = result.diagnostics.find((d) => d.code === "FRE002")!;
    expect(diag.level).toBe("error");
    const fixed = diag.fix!.apply(s);
    expect(fixed.flags.seconds).toBeUndefined();
    expect(lint(fixed).diagnostics.map((d) => d.code)).not.toContain("FRE002");
  });

  it("FRE002 does not fire for a positive -s value", () => {
    expect(lint(spec({ flags: { seconds: 5 } })).diagnostics.map((d) => d.code)).not.toContain("FRE002");
  });

  it("a plain free with one unit flag has no diagnostics", () => {
    expect(lint(spec({ flags: { human: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Human-readable sizes' is -h", () => {
    expect(line(getPreset("human-readable")!.apply(spec()))).toBe("free -h");
  });

  it("'Human-readable with totals' is -h -t", () => {
    expect(line(getPreset("human-with-total")!.apply(spec()))).toBe("free -h -t");
  });

  it("'Show sizes in gibibytes' is -g", () => {
    expect(line(getPreset("in-gibibytes")!.apply(spec()))).toBe("free -g");
  });

  it("'Repeat every 5 seconds' is -h --seconds 5", () => {
    expect(line(getPreset("repeat-every-5-seconds")!.apply(spec()))).toBe("free -h --seconds 5");
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("Report memory and swap usage.");
  });

  it("mentions units and totals as trailing clauses", () => {
    expect(describeSpec(spec({ flags: { human: true } }))).toBe("Report memory and swap usage, in human-readable units.");
    expect(describeSpec(spec({ flags: { mega: true } }))).toBe("Report memory and swap usage, in mebibytes.");
    expect(describeSpec(spec({ flags: { giga: true } }))).toBe("Report memory and swap usage, in gibibytes.");
    expect(describeSpec(spec({ flags: { total: true } }))).toBe("Report memory and swap usage, including a totals row.");
  });

  it("mentions the repeat interval", () => {
    expect(describeSpec(spec({ flags: { seconds: 1 } }))).toBe("Report memory and swap usage, repeating every 1 second.");
    expect(describeSpec(spec({ flags: { seconds: 5 } }))).toBe("Report memory and swap usage, repeating every 5 seconds.");
  });
});
