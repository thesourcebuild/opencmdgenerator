import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type ModprobeSpec,
} from "@cmdgen/modprobe";

const line = (spec: ModprobeSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<ModprobeSpec> = {}): ModprobeSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("modprobe", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("modprobe");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("modprobe alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Load or remove kernel modules");
  });
  it("preset load", () => {
    expect(line(getPreset("load")!.apply(spec()))).toBe("modprobe br_netfilter");
  });
  it("preset remove", () => {
    expect(line(getPreset("remove")!.apply(spec()))).toBe("modprobe -r br_netfilter");
  });
});
