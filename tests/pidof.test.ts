import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type PidofSpec,
} from "@cmdgen/pidof";

const line = (spec: PidofSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<PidofSpec> = {}): PidofSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("pidof", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("pidof");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("pidof alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Find process IDs");
  });
  it("preset program", () => {
    expect(line(getPreset("program")!.apply(spec()))).toBe("pidof sshd");
  });
  it("preset single", () => {
    expect(line(getPreset("single")!.apply(spec()))).toBe("pidof -s nginx");
  });
});
