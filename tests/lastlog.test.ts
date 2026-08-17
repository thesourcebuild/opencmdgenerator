import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LastlogSpec,
} from "@cmdgen/lastlog";

const line = (spec: LastlogSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LastlogSpec> = {}): LastlogSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("lastlog", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("lastlog");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("lastlog alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Show last login records");
  });
  it("preset all", () => {
    expect(line(getPreset("all")!.apply(spec()))).toBe("lastlog");
  });
  it("preset user", () => {
    expect(line(getPreset("user")!.apply(spec()))).toBe("lastlog -u alice");
  });
});
