import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type DpkgSpec,
} from "@cmdgen/dpkg";

const line = (spec: DpkgSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<DpkgSpec> = {}): DpkgSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("dpkg", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("dpkg");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("dpkg alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Manage Debian packages");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("dpkg -l");
  });
  it("preset install", () => {
    expect(line(getPreset("install")!.apply(spec()))).toBe("dpkg -i package.deb");
  });
});
