import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type TimeoutSpec,
} from "@cmdgen/timeout";

const line = (spec: TimeoutSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<TimeoutSpec> = {}): TimeoutSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("timeout", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("timeout");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("timeout alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Limit command runtime");
  });
  it("preset limit", () => {
    expect(line(getPreset("limit")!.apply(spec()))).toBe("timeout 10s sleep 30");
  });
  it("preset kill", () => {
    expect(line(getPreset("kill")!.apply(spec()))).toBe("timeout -k 5s 10s sleep 30");
  });
});
