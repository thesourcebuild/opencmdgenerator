import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LsmodSpec,
} from "@cmdgen/lsmod";

const line = (spec: LsmodSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LsmodSpec> = {}): LsmodSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("lsmod", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("lsmod");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("lsmod alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("List kernel modules");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("lsmod");
  });
  it("preset pipe", () => {
    expect(line(getPreset("pipe")!.apply(spec()))).toBe("lsmod usb_storage");
  });
});
