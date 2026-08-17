import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type HostSpec,
} from "@cmdgen/host";

const line = (spec: HostSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<HostSpec> = {}): HostSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("host", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("host");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("host alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Perform DNS lookups");
  });
  it("preset lookup", () => {
    expect(line(getPreset("lookup")!.apply(spec()))).toBe("host example.com");
  });
  it("preset mx", () => {
    expect(line(getPreset("mx")!.apply(spec()))).toBe("host -t MX example.com");
  });
});
