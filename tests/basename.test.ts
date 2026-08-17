import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type BasenameSpec,
} from "@cmdgen/basename";

const line = (spec: BasenameSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<BasenameSpec> = {}): BasenameSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("basename", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("basename");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("basename alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Print filename components");
  });
  it("preset path", () => {
    expect(line(getPreset("path")!.apply(spec()))).toBe("basename /usr/bin/node");
  });
  it("preset suffix", () => {
    expect(line(getPreset("suffix")!.apply(spec()))).toBe("basename -s .txt notes.txt");
  });
});
