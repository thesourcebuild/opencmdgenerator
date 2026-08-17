import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LsattrSpec,
} from "@cmdgen/lsattr";

const line = (spec: LsattrSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LsattrSpec> = {}): LsattrSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("lsattr", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("lsattr");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("lsattr alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("List file attributes");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("lsattr file.txt");
  });
  it("preset recursive", () => {
    expect(line(getPreset("recursive")!.apply(spec()))).toBe("lsattr -R /etc");
  });
});
