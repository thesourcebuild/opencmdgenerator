import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type MkswapSpec,
} from "@cmdgen/mkswap";

const line = (spec: MkswapSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<MkswapSpec> = {}): MkswapSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("mkswap", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("mkswap");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("mkswap alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Create swap areas");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("mkswap /swapfile");
  });
  it("preset label", () => {
    expect(line(getPreset("label")!.apply(spec()))).toBe("mkswap -L SWAP /swapfile");
  });
});
