import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type IpSpec,
} from "@cmdgen/ip";

const line = (spec: IpSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<IpSpec> = {}): IpSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("ip", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("ip");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("ip alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Show and manipulate Linux networking objects");
  });
  it("preset addr", () => {
    expect(line(getPreset("addr")!.apply(spec()))).toBe("ip addr show");
  });
  it("preset brief", () => {
    expect(line(getPreset("brief")!.apply(spec()))).toBe("ip -br addr");
  });
  it("preset route", () => {
    expect(line(getPreset("route")!.apply(spec()))).toBe("ip route show");
  });
});
