import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LsofSpec,
} from "@cmdgen/lsof";

const line = (spec: LsofSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LsofSpec> = {}): LsofSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("lsof", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("lsof");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("lsof alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("List open files");
  });
  it("preset port", () => {
    expect(line(getPreset("port")!.apply(spec()))).toBe("lsof -i :80");
  });
  it("preset fast", () => {
    expect(line(getPreset("fast")!.apply(spec()))).toBe("lsof -i :443 -n -P");
  });
});
