import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type SnapSpec,
} from "@cmdgen/snap";

const line = (spec: SnapSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<SnapSpec> = {}): SnapSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("snap", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("snap");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("snap alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Manage snap packages");
  });
  it("preset install", () => {
    expect(line(getPreset("install")!.apply(spec()))).toBe("snap install code");
  });
  it("preset classic", () => {
    expect(line(getPreset("classic")!.apply(spec()))).toBe("snap --classic install code");
  });
});
