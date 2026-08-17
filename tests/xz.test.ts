import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type XzSpec,
} from "@cmdgen/xz";

const line = (spec: XzSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<XzSpec> = {}): XzSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("xz", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("xz");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("xz alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Compress files with xz");
  });
  it("preset compress", () => {
    expect(line(getPreset("compress")!.apply(spec()))).toBe("xz archive.tar");
  });
  it("preset keep", () => {
    expect(line(getPreset("keep")!.apply(spec()))).toBe("xz -k archive.tar");
  });
});
