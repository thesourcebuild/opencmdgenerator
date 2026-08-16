import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type PasteSpec,
} from "@cmdgen/paste";

const line = (spec: PasteSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<PasteSpec> = {}): PasteSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("paste", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("paste");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("paste alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Merge lines of files side by side or serially");
  });
  it("preset side", () => {
    expect(line(getPreset("side")!.apply(spec()))).toBe("paste names.txt values.txt");
  });
  it("preset csv", () => {
    expect(line(getPreset("csv")!.apply(spec()))).toBe("paste -d , names.txt values.txt");
  });
});
