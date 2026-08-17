import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type NcSpec,
} from "@cmdgen/nc";

const line = (spec: NcSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<NcSpec> = {}): NcSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("nc", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("nc");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("nc alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Open network connections");
  });
  it("preset connect", () => {
    expect(line(getPreset("connect")!.apply(spec()))).toBe("nc example.com 80");
  });
  it("preset scan", () => {
    expect(line(getPreset("scan")!.apply(spec()))).toBe("nc -z -v example.com 443");
  });
});
