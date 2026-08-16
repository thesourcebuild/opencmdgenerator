import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type DateSpec,
} from "@cmdgen/date";

const line = (spec: DateSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<DateSpec> = {}): DateSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("date", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("date");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("date alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Print or set the system date and time");
  });
  it("preset iso", () => {
    expect(line(getPreset("iso")!.apply(spec()))).toBe("date +%F");
  });
  it("preset utc", () => {
    expect(line(getPreset("utc")!.apply(spec()))).toBe("date -u");
  });
  it("preset yesterday", () => {
    expect(line(getPreset("yesterday")!.apply(spec()))).toBe("date -d yesterday");
  });
});
