import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LscpuSpec,
} from "@cmdgen/lscpu";

const line = (spec: LscpuSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LscpuSpec> = {}): LscpuSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("lscpu", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("lscpu");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("lscpu alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display CPU architecture information");
  });
  it("preset summary", () => {
    expect(line(getPreset("summary")!.apply(spec()))).toBe("lscpu");
  });
  it("preset json", () => {
    expect(line(getPreset("json")!.apply(spec()))).toBe("lscpu -J");
  });
  it("preset extended", () => {
    expect(line(getPreset("extended")!.apply(spec()))).toBe("lscpu -e");
  });
});
