import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FgrepSpec,
} from "@cmdgen/fgrep";

const line = (spec: FgrepSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FgrepSpec> = {}): FgrepSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("fgrep", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("fgrep");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("fgrep alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Search for fixed strings");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("fgrep needle file.txt");
  });
  it("preset recursive", () => {
    expect(line(getPreset("recursive")!.apply(spec()))).toBe("fgrep -n -r TODO src");
  });
});
