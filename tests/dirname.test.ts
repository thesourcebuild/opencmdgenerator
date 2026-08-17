import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type DirnameSpec,
} from "@cmdgen/dirname";

const line = (spec: DirnameSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<DirnameSpec> = {}): DirnameSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("dirname", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("dirname");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("dirname alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Print directory components");
  });
  it("preset path", () => {
    expect(line(getPreset("path")!.apply(spec()))).toBe("dirname /usr/bin/node");
  });
  it("preset relative", () => {
    expect(line(getPreset("relative")!.apply(spec()))).toBe("dirname src/index.ts");
  });
});
