import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type EgrepSpec,
} from "@cmdgen/egrep";

const line = (spec: EgrepSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<EgrepSpec> = {}): EgrepSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("egrep", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("egrep");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("egrep alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Search text using extended regular expressions");
  });
  it("preset search", () => {
    expect(line(getPreset("search")!.apply(spec()))).toBe("egrep error app.log");
  });
  it("preset recursive", () => {
    expect(line(getPreset("recursive")!.apply(spec()))).toBe("egrep -r TODO src");
  });
});
