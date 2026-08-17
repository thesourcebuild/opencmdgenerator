import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type GdiskSpec,
} from "@cmdgen/gdisk";

const line = (spec: GdiskSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<GdiskSpec> = {}): GdiskSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("gdisk", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("gdisk");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("gdisk alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Manage GPT partition tables");
  });
  it("preset device", () => {
    expect(line(getPreset("device")!.apply(spec()))).toBe("gdisk /dev/sda");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("gdisk -l /dev/sda");
  });
});
