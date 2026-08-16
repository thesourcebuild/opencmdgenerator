import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type TimedatectlSpec,
} from "@cmdgen/timedatectl";

const line = (spec: TimedatectlSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<TimedatectlSpec> = {}): TimedatectlSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("timedatectl", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("timedatectl");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("timedatectl alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Control system time settings");
  });
  it("preset status", () => {
    expect(line(getPreset("status")!.apply(spec()))).toBe("timedatectl status");
  });
  it("preset timezone", () => {
    expect(line(getPreset("timezone")!.apply(spec()))).toBe("timedatectl set-timezone UTC");
  });
});
