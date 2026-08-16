import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type LspciSpec,
} from "@cmdgen/lspci";

const line = (spec: LspciSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<LspciSpec> = {}): LspciSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("lspci", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("lspci");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("lspci alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("List PCI devices");
  });
  it("preset list", () => {
    expect(line(getPreset("list")!.apply(spec()))).toBe("lspci");
  });
  it("preset drivers", () => {
    expect(line(getPreset("drivers")!.apply(spec()))).toBe("lspci -k");
  });
  it("preset numeric", () => {
    expect(line(getPreset("numeric")!.apply(spec()))).toBe("lspci -nn");
  });
});
