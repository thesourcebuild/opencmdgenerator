import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type SdiffSpec,
} from "@cmdgen/sdiff";

const line = (spec: SdiffSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<SdiffSpec> = {}): SdiffSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("sdiff", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("sdiff");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("sdiff alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Compare files side by side");
  });
  it("preset compare", () => {
    expect(line(getPreset("compare")!.apply(spec()))).toBe("sdiff old.txt new.txt");
  });
  it("preset wide", () => {
    expect(line(getPreset("wide")!.apply(spec()))).toBe("sdiff -w 120 old.txt new.txt");
  });
});
