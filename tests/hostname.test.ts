import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type HostnameSpec,
} from "@cmdgen/hostname";

const line = (spec: HostnameSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<HostnameSpec> = {}): HostnameSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("hostname", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("hostname");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("hostname alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Show or set the system host name");
  });
  it("preset show", () => {
    expect(line(getPreset("show")!.apply(spec()))).toBe("hostname");
  });
  it("preset fqdn", () => {
    expect(line(getPreset("fqdn")!.apply(spec()))).toBe("hostname -f");
  });
  it("preset set", () => {
    expect(line(getPreset("set")!.apply(spec()))).toBe("hostname web01");
  });
});
