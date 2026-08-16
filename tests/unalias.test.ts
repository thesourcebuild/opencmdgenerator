import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type UnaliasSpec,
} from "@cmdgen/unalias";

const line = (spec: UnaliasSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<UnaliasSpec> = {}): UnaliasSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("unalias", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("unalias");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("unalias alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Remove shell alias definitions");
  });
  it("preset one", () => {
    expect(line(getPreset("one")!.apply(spec()))).toBe("unalias ll");
  });
  it("preset all", () => {
    expect(line(getPreset("all")!.apply(spec()))).toBe("unalias -a");
  });
});
