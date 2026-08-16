import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type TelnetSpec,
} from "@cmdgen/telnet";

const line = (spec: TelnetSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<TelnetSpec> = {}): TelnetSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("telnet", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("telnet");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("telnet alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Connect to a host using the Telnet protocol");
  });
  it("preset connect", () => {
    expect(line(getPreset("connect")!.apply(spec()))).toBe("telnet example.com 23");
  });
  it("preset port", () => {
    expect(line(getPreset("port")!.apply(spec()))).toBe("telnet example.com 80");
  });
});
