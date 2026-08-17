import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type Fail2banClientSpec,
} from "@cmdgen/fail2ban-client";

const line = (spec: Fail2banClientSpec) =>
  renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<Fail2banClientSpec> = {}): Fail2banClientSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("fail2ban-client", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("fail2ban-client");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("fail2ban-client alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Control Fail2ban");
  });
  it("preset status", () => {
    expect(line(getPreset("status")!.apply(spec()))).toBe("fail2ban-client status sshd");
  });
  it("preset reload", () => {
    expect(line(getPreset("reload")!.apply(spec()))).toBe("fail2ban-client reload");
  });
});
