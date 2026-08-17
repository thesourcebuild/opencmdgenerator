import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type OdSpec,
} from "@cmdgen/od";

const line = (spec: OdSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<OdSpec> = {}): OdSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("od", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("od");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("od alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Dump file bytes");
  });
  it("preset hex", () => {
    expect(line(getPreset("hex")!.apply(spec()))).toBe("od -t x1 file.bin");
  });
  it("preset chars", () => {
    expect(line(getPreset("chars")!.apply(spec()))).toBe("od -c file.txt");
  });
});
