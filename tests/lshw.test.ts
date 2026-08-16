import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LshwSpec,
} from "@cmdgen/lshw";

const line = (spec: LshwSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LshwSpec> = {}): LshwSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("lshw", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("lshw");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("lshw alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display hardware information");
  });
  it("preset short", () => {
    expect(line(getPreset("short")!.apply(spec()))).toBe("lshw -short");
  });
  it("preset memory", () => {
    expect(line(getPreset("memory")!.apply(spec()))).toBe("lshw -class memory");
  });
});
