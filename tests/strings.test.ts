import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type StringsSpec,
} from "@cmdgen/strings";

const line = (spec: StringsSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<StringsSpec> = {}): StringsSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("strings", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("strings");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("strings alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Extract printable strings");
  });
  it("preset binary", () => {
    expect(line(getPreset("binary")!.apply(spec()))).toBe("strings binary.bin");
  });
  it("preset long", () => {
    expect(line(getPreset("long")!.apply(spec()))).toBe("strings -n 8 binary.bin");
  });
});
