import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type XargsSpec,
} from "@cmdgen/xargs";

const line = (spec: XargsSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<XargsSpec> = {}): XargsSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("xargs", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("xargs");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("xargs alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain(
      "Build and execute command lines from standard input",
    );
  });
  it("preset null", () => {
    expect(line(getPreset("null")!.apply(spec()))).toBe("xargs -0 rm -f");
  });
  it("preset one", () => {
    expect(line(getPreset("one")!.apply(spec()))).toBe("xargs -n 1 echo");
  });
});
