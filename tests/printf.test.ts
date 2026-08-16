import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type PrintfSpec,
} from "@cmdgen/printf";

const line = (spec: PrintfSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<PrintfSpec> = {}): PrintfSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("printf", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("printf");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("printf alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Format and print data");
  });
  it("preset line", () => {
    expect(line(getPreset("line")!.apply(spec()))).toBe("printf '%s\\n' hello");
  });
  it("preset number", () => {
    expect(line(getPreset("number")!.apply(spec()))).toBe("printf '%04d\\n' 7");
  });
});
