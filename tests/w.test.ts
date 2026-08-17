import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type WSpec,
} from "@cmdgen/w";

const line = (spec: WSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<WSpec> = {}): WSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("w", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("w");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("w alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Show users and activity");
  });
  it("preset show", () => {
    expect(line(getPreset("show")!.apply(spec()))).toBe("w");
  });
  it("preset user", () => {
    expect(line(getPreset("user")!.apply(spec()))).toBe("w alice");
  });
});
