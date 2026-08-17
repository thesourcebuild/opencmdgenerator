import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type PstreeSpec,
} from "@cmdgen/pstree";

const line = (spec: PstreeSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<PstreeSpec> = {}): PstreeSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("pstree", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("pstree");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("pstree alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display process trees");
  });
  it("preset tree", () => {
    expect(line(getPreset("tree")!.apply(spec()))).toBe("pstree");
  });
  it("preset pids", () => {
    expect(line(getPreset("pids")!.apply(spec()))).toBe("pstree -p");
  });
});
