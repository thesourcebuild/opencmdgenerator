import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LsusbSpec,
} from "@cmdgen/lsusb";

const line = (spec: LsusbSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LsusbSpec> = {}): LsusbSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("lsusb", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("lsusb");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("lsusb alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("List USB devices");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("lsusb");
  });
  it("preset tree", () => {
    expect(line(getPreset("tree")!.apply(spec()))).toBe("lsusb -t");
  });
  it("preset device", () => {
    expect(line(getPreset("device")!.apply(spec()))).toBe("lsusb -d 046d:c534");
  });
});
