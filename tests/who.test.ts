import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type WhoSpec,
} from "@cmdgen/who";

const line = (spec: WhoSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<WhoSpec> = {}): WhoSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("who", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("who");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("who alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Show logged-in users");
  });
  it("preset show", () => {
    expect(line(getPreset("show")!.apply(spec()))).toBe("who");
  });
  it("preset heading", () => {
    expect(line(getPreset("heading")!.apply(spec()))).toBe("who -H");
  });
});
