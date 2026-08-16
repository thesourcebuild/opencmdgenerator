import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type SsSpec,
} from "@cmdgen/ss";

const line = (spec: SsSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<SsSpec> = {}): SsSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("ss", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("ss");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("ss alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Inspect sockets and network connections");
  });
  it("preset tcp", () => {
    expect(line(getPreset("tcp")!.apply(spec()))).toBe("ss -t -l -n");
  });
  it("preset processes", () => {
    expect(line(getPreset("processes")!.apply(spec()))).toBe("ss -a -p");
  });
});
