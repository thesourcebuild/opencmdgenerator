import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type DmesgSpec,
} from "@cmdgen/dmesg";

const line = (spec: DmesgSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<DmesgSpec> = {}): DmesgSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("dmesg", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("dmesg");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("dmesg alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Print or control the kernel ring buffer");
  });
  it("preset human", () => {
    expect(line(getPreset("human")!.apply(spec()))).toBe("dmesg -H");
  });
  it("preset follow", () => {
    expect(line(getPreset("follow")!.apply(spec()))).toBe("dmesg -w");
  });
  it("preset levels", () => {
    expect(line(getPreset("levels")!.apply(spec()))).toBe("dmesg -l err,warn");
  });
});
