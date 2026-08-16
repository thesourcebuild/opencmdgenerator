import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type BgSpec,
} from "@cmdgen/bg";

const line = (spec: BgSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<BgSpec> = {}): BgSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("bg", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("bg");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("bg alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Resume jobs in the background");
  });
  it("preset current", () => {
    expect(line(getPreset("current")!.apply(spec()))).toBe("bg");
  });
  it("preset job", () => {
    expect(line(getPreset("job")!.apply(spec()))).toBe("bg %1");
  });
});
