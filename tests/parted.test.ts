import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type PartedSpec,
} from "@cmdgen/parted";

const line = (spec: PartedSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<PartedSpec> = {}): PartedSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("parted", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("parted");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("parted alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Manage disk partitions");
  });
  it("preset print", () => {
    expect(line(getPreset("print")!.apply(spec()))).toBe("parted /dev/sda print");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("parted -l");
  });
});
