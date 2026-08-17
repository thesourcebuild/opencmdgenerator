import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type EnvSpec,
} from "@cmdgen/env";

const line = (spec: EnvSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<EnvSpec> = {}): EnvSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("env", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("env");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("env alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Print or modify environment");
  });
  it("preset print", () => {
    expect(line(getPreset("print")!.apply(spec()))).toBe("env");
  });
  it("preset clean", () => {
    expect(line(getPreset("clean")!.apply(spec()))).toBe("env -i FOO=bar command");
  });
});
