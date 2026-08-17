import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type StraceSpec,
} from "@cmdgen/strace";

const line = (spec: StraceSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<StraceSpec> = {}): StraceSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("strace", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("strace");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("strace alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Trace system calls");
  });
  it("preset command", () => {
    expect(line(getPreset("command")!.apply(spec()))).toBe("strace ls");
  });
  it("preset attach", () => {
    expect(line(getPreset("attach")!.apply(spec()))).toBe("strace -p 1234");
  });
});
