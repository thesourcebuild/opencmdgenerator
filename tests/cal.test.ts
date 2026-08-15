import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type CalSpec } from "@cmdgen/cal";

const line = (spec: CalSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<CalSpec> = {}): CalSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("flags, month/year, and argv rendering", () => {
  it("a bare cal with no flags, month, or year", () => {
    expect(line(spec())).toBe("cal");
  });

  it("renders -1, -3, -y, -m, -j", () => {
    expect(line(spec({ flags: { oneMonth: true } }))).toBe("cal -1");
    expect(line(spec({ flags: { threeMonths: true } }))).toBe("cal -3");
    expect(line(spec({ flags: { wholeYear: true } }))).toBe("cal -y");
    expect(line(spec({ flags: { mondayFirst: true } }))).toBe("cal -m");
    expect(line(spec({ flags: { julian: true } }))).toBe("cal -j");
  });

  it("renders month only as a bare value", () => {
    expect(line(spec({ month: "3" }))).toBe("cal 3");
  });

  it("renders year only as a bare value", () => {
    expect(line(spec({ year: "2026" }))).toBe("cal 2026");
  });

  it("renders month and year together, month first", () => {
    expect(line(spec({ month: "3", year: "2026" }))).toBe("cal 3 2026");
  });

  it("trims whitespace from month and year", () => {
    expect(line(spec({ month: "  3  ", year: "  2026  " }))).toBe("cal 3 2026");
  });

  it("combines a flag with month and year", () => {
    expect(line(spec({ month: "3", year: "2026", flags: { mondayFirst: true } }))).toBe("cal -m 3 2026");
  });
});

describe("macOS (BSD cal) — -m means something else entirely there, so it's Linux only", () => {
  // Confirmed against a real macOS terminal: `cal -m` fails with
  // "option requires an argument -- 'm'" — macOS's -m takes a month number,
  // it isn't a boolean "Monday first" flag like Linux's util-linux cal.
  const mac = (partial: Partial<CalSpec> = {}): CalSpec => spec({ platform: "mac", ...partial });

  it("silently drops mondayFirst — it doesn't exist on macOS's cal", () => {
    expect(line(mac({ flags: { mondayFirst: true } }))).toBe("cal");
  });

  it("still renders the flags common to both dialects", () => {
    expect(line(mac({ flags: { oneMonth: true } }))).toBe("cal -1");
    expect(line(mac({ flags: { threeMonths: true } }))).toBe("cal -3");
    expect(line(mac({ flags: { wholeYear: true } }))).toBe("cal -y");
    expect(line(mac({ flags: { julian: true } }))).toBe("cal -j");
  });

  it("still supports month/year as bare values — this is how macOS's -m month gets covered without a separate flag", () => {
    expect(line(mac({ month: "3", year: "2026" }))).toBe("cal 3 2026");
  });
});

describe("lint", () => {
  it("nothing to flag, ever", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(
      lint(spec({ month: "13", year: "abc", flags: { threeMonths: true, wholeYear: true } })).diagnostics,
    ).toEqual([]);
  });
});

describe("presets", () => {
  it("'This month' is a bare cal", () => {
    expect(line(getPreset("this-month")!.apply(spec()))).toBe("cal");
  });

  it("'Whole year' is cal -y", () => {
    expect(line(getPreset("whole-year")!.apply(spec()))).toBe("cal -y");
  });

  it("'Week starts Monday' is cal -m", () => {
    expect(line(getPreset("monday-first")!.apply(spec()))).toBe("cal -m");
  });

  it("'Week starts Monday' is Linux only", () => {
    const mac = spec({ platform: "mac" });
    expect(getPreset("monday-first")!.isApplicable?.(mac)).toBe(false);
    expect(getPreset("monday-first")!.apply(mac)).toEqual(mac);
  });
});

describe("describeSpec", () => {
  it("describes the default case", () => {
    expect(describeSpec(spec())).toBe("Display a calendar for the current month.");
  });

  it("describes a year-only calendar", () => {
    expect(describeSpec(spec({ year: "2026" }))).toBe("Display a calendar for the year 2026.");
  });

  it("describes a month-only calendar", () => {
    expect(describeSpec(spec({ month: "3" }))).toBe("Display a calendar for month 3 of the current year.");
  });

  it("mentions -3/-y span, Monday-first, and Julian day numbers as trailing clauses", () => {
    const result = describeSpec(spec({ flags: { threeMonths: true, mondayFirst: true, julian: true } }));
    expect(result).toContain("showing the previous, current, and next month");
    expect(result).toContain("with Monday as the first day of the week");
    expect(result).toContain("showing Julian day-of-year numbers");
  });
});
