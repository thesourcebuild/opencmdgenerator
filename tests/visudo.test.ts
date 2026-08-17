import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type VisudoSpec,
} from "@cmdgen/visudo";

const line = (spec: VisudoSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<VisudoSpec> = {}): VisudoSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("visudo", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("visudo");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("visudo alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Validate or edit sudoers");
  });
  it("preset check", () => {
    expect(line(getPreset("check")!.apply(spec()))).toBe("visudo -c");
  });
  it("preset file", () => {
    expect(line(getPreset("file")!.apply(spec()))).toBe("visudo -c -f /etc/sudoers.d/admins");
  });
});
