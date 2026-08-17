import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type RmmodSpec,
} from "@cmdgen/rmmod";

const line = (spec: RmmodSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<RmmodSpec> = {}): RmmodSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("rmmod", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("rmmod");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("rmmod alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Remove kernel modules");
  });
  it("preset remove", () => {
    expect(line(getPreset("remove")!.apply(spec()))).toBe("rmmod br_netfilter");
  });
  it("preset verbose", () => {
    expect(line(getPreset("verbose")!.apply(spec()))).toBe("rmmod -v br_netfilter");
  });
});
