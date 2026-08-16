import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type NiceSpec,
} from "@cmdgen/nice";

const line = (spec: NiceSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<NiceSpec> = {}): NiceSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("nice", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("nice");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("nice alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Run a command with modified scheduling priority");
  });
  it("preset lower", () => {
    expect(line(getPreset("lower")!.apply(spec()))).toBe("nice -n 10 make -j4");
  });
  it("preset default", () => {
    expect(line(getPreset("default")!.apply(spec()))).toBe("nice command");
  });
});
