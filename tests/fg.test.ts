import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FgSpec,
} from "@cmdgen/fg";

const line = (spec: FgSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FgSpec> = {}): FgSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("fg", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("fg");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("fg alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Bring a background job to the foreground");
  });
  it("preset current", () => {
    expect(line(getPreset("current")!.apply(spec()))).toBe("fg");
  });
  it("preset job", () => {
    expect(line(getPreset("job")!.apply(spec()))).toBe("fg %1");
  });
});
