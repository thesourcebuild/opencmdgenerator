import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type Tune2fsSpec,
} from "@cmdgen/tune2fs";

const line = (spec: Tune2fsSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<Tune2fsSpec> = {}): Tune2fsSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("tune2fs", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("tune2fs");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("tune2fs alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Tune ext filesystems");
  });
  it("preset label", () => {
    expect(line(getPreset("label")!.apply(spec()))).toBe("tune2fs -L DATA /dev/sda1");
  });
  it("preset show", () => {
    expect(line(getPreset("show")!.apply(spec()))).toBe("tune2fs -l /dev/sda1");
  });
});
