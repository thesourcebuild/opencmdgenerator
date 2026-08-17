import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type ArchSpec,
} from "@cmdgen/arch";

const line = (spec: ArchSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<ArchSpec> = {}): ArchSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("arch", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("arch");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("arch alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Print machine architecture");
  });
  it("preset show", () => {
    expect(line(getPreset("show")!.apply(spec()))).toBe("arch");
  });
  it("preset help", () => {
    expect(line(getPreset("help")!.apply(spec()))).toBe("arch --help");
  });
});
