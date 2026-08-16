import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type RealpathSpec,
} from "@cmdgen/realpath";

const line = (spec: RealpathSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<RealpathSpec> = {}): RealpathSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("realpath", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("realpath");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("realpath alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Resolve absolute file paths");
  });
  it("preset resolve", () => {
    expect(line(getPreset("resolve")!.apply(spec()))).toBe("realpath ./src/../README.md");
  });
  it("preset relative", () => {
    expect(line(getPreset("relative")!.apply(spec()))).toBe(
      "realpath --relative-to /repo /repo/src/index.ts",
    );
  });
});
