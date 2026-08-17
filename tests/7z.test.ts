import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type SevenzSpec,
} from "@cmdgen/7z";

const line = (spec: SevenzSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<SevenzSpec> = {}): SevenzSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("7z", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("7z");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("7z alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Manage 7-Zip archives");
  });
  it("preset extract", () => {
    expect(line(getPreset("extract")!.apply(spec()))).toBe("7z x archive.7z");
  });
  it("preset create", () => {
    expect(line(getPreset("create")!.apply(spec()))).toBe("7z a archive.7z files");
  });
});
