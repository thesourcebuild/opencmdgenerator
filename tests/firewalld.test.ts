import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type FirewalldSpec,
} from "@cmdgen/firewalld";

const line = (spec: FirewalldSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<FirewalldSpec> = {}): FirewalldSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("firewalld", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("firewalld");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("firewalld alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Run firewalld service commands");
  });
  it("preset foreground", () => {
    expect(line(getPreset("foreground")!.apply(spec()))).toBe("firewalld --nofork");
  });
  it("preset debug", () => {
    expect(line(getPreset("debug")!.apply(spec()))).toBe("firewalld --nofork --debug 1");
  });
});
