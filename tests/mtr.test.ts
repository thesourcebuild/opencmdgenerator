import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type MtrSpec,
} from "@cmdgen/mtr";

const line = (spec: MtrSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<MtrSpec> = {}): MtrSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("mtr", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("mtr");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("mtr alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Trace network paths continuously");
  });
  it("preset host", () => {
    expect(line(getPreset("host")!.apply(spec()))).toBe("mtr example.com");
  });
  it("preset report", () => {
    expect(line(getPreset("report")!.apply(spec()))).toBe("mtr -r -c 10 example.com");
  });
});
