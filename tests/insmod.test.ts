import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type InsmodSpec,
} from "@cmdgen/insmod";

const line = (spec: InsmodSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<InsmodSpec> = {}): InsmodSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("insmod", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("insmod");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("insmod alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Insert kernel module files");
  });
  it("preset insert", () => {
    expect(line(getPreset("insert")!.apply(spec()))).toBe("insmod module.ko");
  });
  it("preset params", () => {
    expect(line(getPreset("params")!.apply(spec()))).toBe("insmod module.ko debug=1");
  });
});
