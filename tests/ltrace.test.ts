import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LtraceSpec,
} from "@cmdgen/ltrace";

const line = (spec: LtraceSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LtraceSpec> = {}): LtraceSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("ltrace", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("ltrace");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("ltrace alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Trace library calls");
  });
  it("preset command", () => {
    expect(line(getPreset("command")!.apply(spec()))).toBe("ltrace ./app");
  });
  it("preset attach", () => {
    expect(line(getPreset("attach")!.apply(spec()))).toBe("ltrace -p 1234");
  });
});
