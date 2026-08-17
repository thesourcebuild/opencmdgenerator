import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type SwaponSpec,
} from "@cmdgen/swapon";

const line = (spec: SwaponSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<SwaponSpec> = {}): SwaponSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("swapon", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("swapon");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("swapon alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Enable swap");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("swapon /swapfile");
  });
  it("preset all", () => {
    expect(line(getPreset("all")!.apply(spec()))).toBe("swapon -a");
  });
});
