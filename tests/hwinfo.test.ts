import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type HwinfoSpec,
} from "@cmdgen/hwinfo";

const line = (spec: HwinfoSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<HwinfoSpec> = {}): HwinfoSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("hwinfo", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("hwinfo");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("hwinfo alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Display detailed hardware information");
  });
  it("preset short", () => {
    expect(line(getPreset("short")!.apply(spec()))).toBe("hwinfo --short");
  });
  it("preset network", () => {
    expect(line(getPreset("network")!.apply(spec()))).toBe("hwinfo --network");
  });
});
