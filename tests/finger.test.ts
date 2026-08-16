import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FingerSpec,
} from "@cmdgen/finger";

const line = (spec: FingerSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FingerSpec> = {}): FingerSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("finger", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("finger");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("finger alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display user information");
  });
  it("preset user", () => {
    expect(line(getPreset("user")!.apply(spec()))).toBe("finger alice");
  });
  it("preset long", () => {
    expect(line(getPreset("long")!.apply(spec()))).toBe("finger -l alice");
  });
});
