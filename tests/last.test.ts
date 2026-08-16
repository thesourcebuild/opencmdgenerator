import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LastSpec,
} from "@cmdgen/last";

const line = (spec: LastSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LastSpec> = {}): LastSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("last", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("last");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("last alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display recent login sessions");
  });
  it("preset recent", () => {
    expect(line(getPreset("recent")!.apply(spec()))).toBe("last -n 10");
  });
  it("preset user", () => {
    expect(line(getPreset("user")!.apply(spec()))).toBe("last alice");
  });
});
