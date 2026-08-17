import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type SwapoffSpec,
} from "@cmdgen/swapoff";

const line = (spec: SwapoffSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<SwapoffSpec> = {}): SwapoffSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("swapoff", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("swapoff");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("swapoff alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Disable swap");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("swapoff /swapfile");
  });
  it("preset all", () => {
    expect(line(getPreset("all")!.apply(spec()))).toBe("swapoff -a");
  });
});
