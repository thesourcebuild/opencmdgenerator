import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type ReniceSpec,
} from "@cmdgen/renice";

const line = (spec: ReniceSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<ReniceSpec> = {}): ReniceSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("renice", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("renice");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("renice alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Alter priority of running processes");
  });
  it("preset pid", () => {
    expect(line(getPreset("pid")!.apply(spec()))).toBe("renice -p 10 1234");
  });
  it("preset user", () => {
    expect(line(getPreset("user")!.apply(spec()))).toBe("renice -u 5 alice");
  });
});
