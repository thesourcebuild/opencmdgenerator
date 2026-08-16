import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type TreeSpec,
} from "@cmdgen/tree";

const line = (spec: TreeSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<TreeSpec> = {}): TreeSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("tree", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("tree");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("tree alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display directory contents as a visual tree");
  });
  it("preset current", () => {
    expect(line(getPreset("current")!.apply(spec()))).toBe("tree");
  });
  it("preset levels", () => {
    expect(line(getPreset("levels")!.apply(spec()))).toBe("tree -L 2 src");
  });
  it("preset dirs", () => {
    expect(line(getPreset("dirs")!.apply(spec()))).toBe("tree -d .");
  });
});
